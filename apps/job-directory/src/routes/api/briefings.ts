import { createFileRoute } from '@tanstack/react-router';
import { briefingInputSchema } from '../../db/schemas';
import {
  upsertBriefing,
  getBriefingRow,
  listBriefings,
} from '../../db/repo';
import { authorize, jsonError, jsonOk } from '../../server/auth';

export const Route = createFileRoute('/api/briefings')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = authorize(request);
        if (!auth.ok) return auth.response;
        return jsonOk({ briefings: listBriefings() });
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

        const result = briefingInputSchema.safeParse(payload);
        if (!result.success) {
          return jsonError(422, {
            error: 'validation_failed',
            issues: result.error.issues,
          });
        }

        const existed = Boolean(getBriefingRow(result.data.id));
        upsertBriefing(result.data);
        const row = getBriefingRow(result.data.id);
        return jsonOk(
          { status: existed ? 'updated' : 'created', briefing: row },
          existed ? 200 : 201,
        );
      },
    },
  },
});
