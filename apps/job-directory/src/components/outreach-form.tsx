import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { saveOutreach, removeOutreach } from '@/server/content';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/format';

type Props = {
  jobId: string;
  initialBody: string;
  initialHtml: string;
  updatedAt: string | null;
};

export function OutreachForm({
  jobId,
  initialBody,
  initialHtml,
  updatedAt,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'saved'; at: number }
    | { kind: 'cleared'; at: number }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' });
  const [copyState, setCopyState] = useState<
    'idle' | 'copied' | 'error'
  >('idle');

  const form = useForm({
    defaultValues: { body: initialBody },
    onSubmit: async ({ value }) => {
      const trimmed = value.body.trim();
      try {
        if (trimmed.length === 0) {
          await removeOutreach({ data: jobId });
          setStatus({ kind: 'cleared', at: Date.now() });
        } else {
          const result = await saveOutreach({
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

  const copy = async () => {
    const text = form.state.values.body.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1500);
    } catch {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2500);
    }
  };

  return (
    <section className="mt-12 space-y-4 rounded-md border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg">Outreach</h2>
        {updatedAt && (
          <span className="font-mono text-xs text-muted-foreground">
            last saved {formatDate(updatedAt)}
          </span>
        )}
      </div>

      {initialHtml ? (
        <div
          className="prose-outreach text-sm leading-relaxed text-foreground/80"
          dangerouslySetInnerHTML={{ __html: initialHtml }}
        />
      ) : (
        <p className="text-xs text-muted-foreground">
          No outreach drafted yet. Write the message you'd send for this
          posting; markdown is rendered above.
        </p>
      )}

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <Label htmlFor={`outreach-${jobId}`} className="sr-only">
          Outreach markdown
        </Label>
        <form.Field name="body">
          {(field) => (
            <Textarea
              id={`outreach-${jobId}`}
              name="body"
              rows={8}
              placeholder="# Hi <team>,&#10;&#10;Why this role caught my eye…&#10;&#10;— Sebastian"
              className="font-mono text-xs"
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
            {status.kind === 'idle' && copyState === 'copied' && 'Copied.'}
            {status.kind === 'idle' && copyState === 'error' && (
              <span className="text-destructive">
                Copy failed — clipboard blocked.
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <form.Subscribe selector={(s) => s.values.body.trim().length > 0}>
              {(hasBody) => (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copy}
                  disabled={!hasBody}
                  aria-label="Copy outreach to clipboard"
                >
                  {copyState === 'copied' ? <Check /> : <Copy />}
                  {copyState === 'copied' ? 'Copied' : 'Copy'}
                </Button>
              )}
            </form.Subscribe>
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit} size="sm">
                  {isSubmitting ? 'Saving…' : initialBody ? 'Update' : 'Save'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </form>
    </section>
  );
}
