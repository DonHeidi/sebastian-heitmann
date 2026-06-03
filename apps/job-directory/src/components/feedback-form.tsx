import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { saveFeedback, removeFeedback } from '@/server/content';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/format';

type Props = {
  jobId: string;
  initialBody: string;
  updatedAt: string | null;
};

export function FeedbackForm({ jobId, initialBody, updatedAt }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'saved'; at: number }
    | { kind: 'cleared'; at: number }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' });

  const form = useForm({
    defaultValues: { body: initialBody },
    onSubmit: async ({ value }) => {
      const trimmed = value.body.trim();
      try {
        if (trimmed.length === 0) {
          await removeFeedback({ data: jobId });
          setStatus({ kind: 'cleared', at: Date.now() });
        } else {
          const result = await saveFeedback({
            data: { job_id: jobId, body: trimmed },
          });
          if (!result.ok) {
            setStatus({
              kind: 'error',
              message: `Could not save: ${result.reason}`,
            });
            return;
          }
          setStatus({ kind: 'saved', at: Date.now() });
        }
        await router.invalidate();
      } catch (err) {
        setStatus({
          kind: 'error',
          message: err instanceof Error ? err.message : String(err),
        });
      }
    },
  });

  return (
    <form
      className="mt-12 space-y-3 rounded-md border border-border bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={`feedback-${jobId}`} className="font-display text-base">
          Feedback for the agent
        </Label>
        {updatedAt && (
          <span className="font-mono text-xs text-muted-foreground">
            last saved {formatDate(updatedAt)}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Free-form notes on why this posting is or isn't a good match. The agent
        will use it as training signal on the next scan.
      </p>

      <form.Field name="body">
        {(field) => (
          <Textarea
            id={`feedback-${jobId}`}
            name="body"
            rows={4}
            placeholder="e.g. Strong stack match but comp band is way under what I'm targeting."
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          {status.kind === 'saved' && 'Saved.'}
          {status.kind === 'cleared' && 'Cleared.'}
          {status.kind === 'error' && (
            <span className="text-destructive">{status.message}</span>
          )}
        </span>
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} size="sm">
              {isSubmitting ? 'Saving…' : initialBody ? 'Update' : 'Save'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
