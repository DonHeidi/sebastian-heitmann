import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import {
  addToShortlist,
  listShortlist,
} from '../../server/shortlist';
import { authorize, jsonError, jsonOk } from '../../server/auth';

const addInputSchema = z.object({
  job_id: z.string().min(1),
});

export const Route = createFileRoute('/api/shortlist')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = authorize(request);
        if (!auth.ok) return auth.response;
        return jsonOk({ shortlist: listShortlist() });
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

        const result = addInputSchema.safeParse(payload);
        if (!result.success) {
          return jsonError(422, {
            error: 'validation_failed',
            issues: result.error.issues,
          });
        }

        const outcome = addToShortlist(result.data.job_id);
        if (!outcome.ok) {
          return jsonError(404, {
            error: outcome.reason,
            message: `No job with id "${result.data.job_id}".`,
          });
        }
        return jsonOk(
          {
            status: outcome.alreadyShortlisted ? 'already_shortlisted' : 'added',
            entry: outcome.entry,
          },
          outcome.alreadyShortlisted ? 200 : 201,
        );
      },
    },
  },
});
