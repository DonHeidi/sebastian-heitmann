export type AuthResult = { ok: true } | { ok: false; response: Response };

export function authorize(request: Request): AuthResult {
  const expected = process.env.JOB_DIRECTORY_API_TOKEN;
  if (!expected) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({
          error: 'server_misconfigured',
          message: 'JOB_DIRECTORY_API_TOKEN is not set on the server.',
        }),
        { status: 503, headers: { 'content-type': 'application/json' } },
      ),
    };
  }

  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match || match[1].trim() !== expected) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: 'unauthorized' }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
            'www-authenticate': 'Bearer realm="job-directory"',
          },
        },
      ),
    };
  }

  return { ok: true };
}

export function jsonError(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export function jsonOk(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
