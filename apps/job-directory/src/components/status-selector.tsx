import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import {
  JOB_STATUS_LABELS,
  JOB_STATUS_VALUES,
  type JobStatusValue,
} from '@/lib/job-status';
import { saveJobStatus } from '@/server/content';
import { cn } from '@/lib/utils';

type Props = {
  jobId: string;
  current: JobStatusValue;
  updatedAt: string | null;
};

export function StatusSelector({ jobId, current, updatedAt }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = async (next: JobStatusValue) => {
    if (next === current) return;
    setPending(true);
    setError(null);
    try {
      const result = await saveJobStatus({
        data: { job_id: jobId, status: next },
      });
      if (!result.ok) {
        setError(`Could not save: ${result.reason}`);
        return;
      }
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <label
        htmlFor={`status-${jobId}`}
        className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
      >
        Status
      </label>
      <select
        id={`status-${jobId}`}
        value={current}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as JobStatusValue)}
        className={cn(
          'h-8 rounded-md border border-input bg-background px-2 text-sm shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {JOB_STATUS_VALUES.map((v) => (
          <option key={v} value={v}>
            {JOB_STATUS_LABELS[v]}
          </option>
        ))}
      </select>
      {updatedAt && (
        <span className="font-mono text-xs text-muted-foreground">
          updated {updatedAt}
        </span>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
