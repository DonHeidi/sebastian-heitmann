import { createFileRoute } from '@tanstack/react-router';
import { removeFromShortlist } from '../../server/shortlist';
import { authorize, jsonOk } from '../../server/auth';

export const Route = createFileRoute('/api/shortlist/$job_id')({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        const auth = authorize(request);
        if (!auth.ok) return auth.response;

        const { removed } = removeFromShortlist(params.job_id);
        return jsonOk({
          status: removed ? 'removed' : 'not_shortlisted',
          job_id: params.job_id,
        });
      },
    },
  },
});
