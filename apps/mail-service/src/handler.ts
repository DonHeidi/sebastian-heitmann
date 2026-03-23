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
  body: string;
};

const REQUIRED_ENV = ['SCW_SECRET_KEY', 'SCW_PROJECT_ID', 'MAIL_RECIPIENT', 'MAIL_SENDER'] as const;

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(statusCode: number, body: Record<string, unknown>): ScalewayResponse {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
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
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, body: '', headers: corsHeaders };
  }

  const envError = validateEnv();
  if (envError) return jsonResponse(500, { error: envError });

  let parsed: unknown;
  try {
    parsed = JSON.parse(event.body);
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' });
  }

  const validated = validateBody(parsed);
  if (typeof validated === 'string') return jsonResponse(400, { error: validated });

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
    const region = process.env.SCW_REGION || 'nl-ams';
    const response = await fetch(`https://api.scaleway.com/transactional-email/v1alpha1/regions/${region}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': process.env.SCW_SECRET_KEY!,
      },
      body: JSON.stringify({
        from: {
          email: process.env.MAIL_SENDER!,
          name: 'Website Contact Form',
        },
        to: [{ email: process.env.MAIL_RECIPIENT! }],
        subject,
        text: textBody,
        project_id: process.env.SCW_PROJECT_ID!,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Scaleway API error:', error);
      return jsonResponse(502, { error: 'Failed to send email' });
    }

    return jsonResponse(200, { success: true });
  } catch (err) {
    console.error('Send error:', err);
    return jsonResponse(500, { error: 'Internal server error' });
  }
}
