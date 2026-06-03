import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import {
  clearFeedback,
  getFeedback,
  setFeedback,
} from '../../server/feedback';
import { authorize, jsonError, jsonOk } from '../../server/auth';

const putInputSchema = z.object({
  body: z.string(),
});

export const Route = createFileRoute('/api/feedback/$job_id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const auth = authorize(request);
        if (!auth.ok) return auth.response;
        const fb = getFeedback(params.job_id);
        if (!fb) {
          return jsonError(404, {
            error: 'feedback_not_found',
            job_id: params.job_id,
          });
        }
        return jsonOk({ feedback: fb });
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

        const outcome = setFeedback(params.job_id, result.data.body);
        if (!outcome.ok) {
          return jsonError(404, {
            error: outcome.reason,
            message: `No job with id "${params.job_id}".`,
          });
        }
        return jsonOk(
          {
            status: outcome.created ? 'created' : 'updated',
            feedback: outcome.feedback,
          },
          outcome.created ? 201 : 200,
        );
      },
      DELETE: async ({ request, params }) => {
        const auth = authorize(request);
        if (!auth.ok) return auth.response;
        const { removed } = clearFeedback(params.job_id);
        return jsonOk({
          status: removed ? 'removed' : 'not_found',
          job_id: params.job_id,
        });
      },
    },
  },
});
