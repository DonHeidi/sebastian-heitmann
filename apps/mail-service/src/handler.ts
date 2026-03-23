type ContactRequest = {
  name: string;
  email: string;
  context?: string;
  message: string;
};

type ScalewayResponse = {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
};

type ScalewayEvent = {
  httpMethod?: string;
  headers?: Record<string, string>;
  body: string;
};

const REQUIRED_ENV = ['TEM_SECRET_KEY', 'TEM_PROJECT_ID', 'MAIL_RECIPIENT', 'MAIL_SENDER'] as const;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

function getCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] || '';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(statusCode: number, body: Record<string, unknown>, origin?: string): ScalewayResponse {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) },
  };
}

function validateEnv(): string | null {
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) return `Missing environment variable: ${key}`;
  }
  return null;
}

function validateBody(body: unknown): ContactRequest | string {
  if (!body || typeof body !== 'object') return 'Request body is required';

  const { name, email, message } = body as Record<string, unknown>;

  if (!name || typeof name !== 'string') return 'Name is required';
  if (!email || typeof email !== 'string') return 'Email is required';
  if (!message || typeof message !== 'string') return 'Message is required';

  return {
    name: name.trim(),
    email: email.trim(),
    context: (body as Record<string, unknown>).context as string | undefined,
    message: message.trim(),
  };
}

export async function handle(event: ScalewayEvent): Promise<ScalewayResponse> {
  const origin = event.headers?.['origin'] || event.headers?.['Origin'];

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, body: '', headers: getCorsHeaders(origin) };
  }

  const envError = validateEnv();
  if (envError) return jsonResponse(500, { error: envError }, origin);

  let parsed: unknown;
  try {
    parsed = JSON.parse(event.body);
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' }, origin);
  }

  const validated = validateBody(parsed);
  if (typeof validated === 'string') return jsonResponse(400, { error: validated }, origin);

  const { name, email, context, message } = validated;
  const subject = `Contact from ${name}`;
  const textBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    context ? `Context: ${context}` : null,
    '',
    message,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const region = process.env.TEM_REGION || 'fr-par';
    const response = await fetch(`https://api.scaleway.com/transactional-email/v1alpha1/regions/${region}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': process.env.TEM_SECRET_KEY!,
      },
      body: JSON.stringify({
        from: {
          email: process.env.MAIL_SENDER!,
          name: 'Website Contact Form',
        },
        to: [{ email: process.env.MAIL_RECIPIENT! }],
        subject,
        text: textBody,
        project_id: process.env.TEM_PROJECT_ID!,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Scaleway API error:', error);
      return jsonResponse(502, { error: 'Failed to send email' }, origin);
    }

    return jsonResponse(200, { success: true }, origin);
  } catch (err) {
    console.error('Send error:', err);
    return jsonResponse(500, { error: 'Internal server error' }, origin);
  }
}
