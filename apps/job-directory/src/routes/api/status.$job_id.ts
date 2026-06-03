import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import {
  clearStatus,
  getStatus,
  setStatus,
} from '../../server/status';
import { JOB_STATUS_VALUES } from '../../lib/job-status';
import { authorize, jsonError, jsonOk } from '../../server/auth';

const putInputSchema = z.object({
  status: z.enum(JOB_STATUS_VALUES),
});

export const Route = createFileRoute('/api/status/$job_id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const auth = authorize(request);
        if (!auth.ok) return auth.response;
        return jsonOk({ status: getStatus(params.job_id) });
      },
      PUT: async ({ request, params }) => {
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

        const result = putInputSchema.safeParse(payload);
        if (!result.success) {
          return jsonError(422, {
            error: 'validation_failed',
            issues: result.error.issues,
          });
        }

        const outcome = setStatus(params.job_id, result.data.status);
        if (!outcome.ok) {
          return jsonError(404, {
            error: outcome.reason,
            message: `No job with id "${params.job_id}".`,
          });
        }
        return jsonOk({ status: outcome.status });
      },
      DELETE: async ({ request, params }) => {
        const auth = authorize(request);
        if (!auth.ok) return auth.response;
        const { removed } = clearStatus(params.job_id);
        return jsonOk({
          status: removed ? 'removed' : 'already_default',
          job_id: params.job_id,
        });
      },
    },
  },
});
