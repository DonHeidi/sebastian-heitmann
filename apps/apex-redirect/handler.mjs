// Apex → www redirect. A Scaleway Serverless Function (node22) bound to the apex
// custom domain (sebastian-heitmann.dev) with a managed TLS cert. Edge Services
// cannot serve a bare apex (subdomain-only), so this tiny function holds the apex
// cert and 301s every request to the www site (served by Edge over the bucket).
// Same pattern as job-directory.eu's apps/apex-redirect.

const TARGET = process.env.REDIRECT_TARGET || 'https://www.sebastian-heitmann.dev';

export async function handle(event) {
  // The runtime should always pass a /-prefixed path; force it so a malformed
  // event can't produce a mangled Location (e.g. https://www.…devimprint).
  const rawPath = (event && event.path) || '/';
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  // Scaleway's node runtime may pass the query as a raw string or a params map;
  // preserve it best-effort (deep links keep their path + query on the redirect).
  const raw = (event && (event.rawQueryString || event.queryString)) || '';
  let qs = raw ? (raw.startsWith('?') ? raw : `?${raw}`) : '';
  if (!qs && event && event.queryStringParameters && Object.keys(event.queryStringParameters).length) {
    qs = '?' + new URLSearchParams(event.queryStringParameters).toString();
  }
  return {
    statusCode: 301,
    headers: {
      Location: `${TARGET}${path}${qs}`,
      'Cache-Control': 'public, max-age=3600',
    },
    body: '',
  };
}
