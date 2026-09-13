#!/usr/bin/env python3
"""Query ONE nameserver directly over UDP, bypassing every resolver cache.

Why this exists: the DNS runbooks in docs/runbooks/ are written as `dig`
commands, but dig/host/nslookup/dnspython are not installed on every machine
that runs them (mise pins no DNS tool). This is a dependency-free stand-in.

Why authoritative queries matter: during an onboarding, public resolvers
negative-cache an NXDOMAIN for the zone's SOA minimum, so a record that IS
live at the registrar reads as missing for minutes afterwards. Asking the
authoritative nameserver directly is the only answer you can trust before
delegation — and after delegation it is how you confirm what Scaleway
actually serves, rather than what your resolver remembers.

Usage:
    python3 scripts/dns-probe.py <nameserver-ip> <name> <TXT|A|NS|CNAME|MX|SOA>

Examples (rocks onboarding, step 5):
    python3 scripts/dns-probe.py 195.154.228.249 www.sebastian-heitmann.rocks CNAME
    python3 scripts/dns-probe.py 195.154.228.249 sebastian-heitmann.rocks MX

Get a nameserver's IP without dig:
    curl -s 'https://dns.google/resolve?name=ns0.dom.scw.cloud&type=A' | jq -r '.Answer[0].data'
"""
import socket, struct, sys

TYPES = {'TXT': 16, 'A': 1, 'NS': 2, 'CNAME': 5, 'SOA': 6, 'MX': 15}


def encode(name):
    out = b''
    for label in name.rstrip('.').split('.'):
        out += bytes([len(label)]) + label.encode()
    return out + b'\x00'


def read_name(buf, off):
    parts = []
    while True:
        ln = buf[off]
        if ln & 0xC0 == 0xC0:  # compression pointer
            ptr = struct.unpack('!H', buf[off:off + 2])[0] & 0x3FFF
            off += 2
            parts.append(read_name(buf, ptr)[0])
            return '.'.join(p for p in parts if p), off
        off += 1
        if ln == 0:
            return '.'.join(parts), off
        parts.append(buf[off:off + ln].decode('latin1'))
        off += ln


def query(server, name, qtype):
    qt = TYPES[qtype]
    pkt = (struct.pack('!HHHHHH', 0x1234, 0x0000, 1, 0, 0, 0)
           + encode(name) + struct.pack('!HH', qt, 1))
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(8)
    s.sendto(pkt, (server, 53))
    buf, _ = s.recvfrom(4096)
    s.close()
    rcode = buf[3] & 0x0F
    ancount = struct.unpack('!H', buf[6:8])[0]
    nscount = struct.unpack('!H', buf[8:10])[0]
    off = 12
    _, off = read_name(buf, off)
    off += 4
    answers = []
    # A registry/TLD server answers a delegated name with a REFERRAL: the NS
    # records land in the AUTHORITY section, not ANSWER. Parsing only ANSWER
    # would make a correct delegation look like an empty response.
    for _ in range(ancount + nscount):
        _, off = read_name(buf, off)
        rtype, _cls, _ttl, rdlen = struct.unpack('!HHIH', buf[off:off + 10])
        off += 10
        rdata = buf[off:off + rdlen]
        if rtype == 16:  # TXT: length-prefixed strings
            txt, p = '', 0
            while p < len(rdata):
                ln = rdata[p]
                txt += rdata[p + 1:p + 1 + ln].decode('latin1')
                p += 1 + ln
            answers.append(txt)
        elif rtype == 1:
            answers.append('.'.join(str(b) for b in rdata))
        elif rtype in (2, 5):
            answers.append(read_name(buf, off)[0])
        elif rtype == 15:  # MX: 2-byte preference + exchange name
            pref = struct.unpack('!H', rdata[:2])[0]
            exch, _ = read_name(buf, off + 2)
            answers.append('%d %s' % (pref, exch if exch else '.'))
        else:
            answers.append('type%d' % rtype)
        off += rdlen
    return {0: 'NOERROR', 3: 'NXDOMAIN'}.get(rcode, 'RCODE%d' % rcode), answers


if __name__ == '__main__':
    server, name, qtype = sys.argv[1], sys.argv[2], sys.argv[3]
    try:
        rcode, ans = query(server, name, qtype)
        print('%-22s %-5s %s' % (server, qtype, name))
        print('   -> %s  %s' % (rcode, ans if ans else '(no records)'))
    except Exception as e:
        print('%-22s %-5s %s\n   -> ERROR %s' % (server, qtype, name, e))
