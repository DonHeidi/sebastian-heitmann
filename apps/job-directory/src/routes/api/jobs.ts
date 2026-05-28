import { createFileRoute } from '@tanstack/react-router';
import { jobInputSchema } from '../../db/schemas';
import { upsertJob, getJobRow, listJobs } from '../../db/repo';
import { authorize, jsonError, jsonOk } from '../../server/auth';

export const Route = createFileRoute('/api/jobs')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = authorize(request);
        if (!auth.ok) return auth.response;
        return jsonOk({ jobs: listJobs() });
      },
      POST: async ({ request }) => {
        const auth = authorize(request);
        if (!auth.ok) return auth.response;

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return jsonError(400, {
            error: 'invalid_json',
            message: 'Request body must be valid JSON.',
          });
        }

        const result = jobInputSchema.safeParse(payload);
        if (!result.success) {
          return jsonError(422, {
            error: 'validation_failed',
            issues: result.error.issues,
          });
        }

        const existed = Boolean(getJobRow(result.data.id));
        upsertJob(result.data);
        const row = getJobRow(result.data.id);
        return jsonOk({ status: existed ? 'updated' : 'created', job: row }, existed ? 200 : 201);
      },
    },
  },
});
