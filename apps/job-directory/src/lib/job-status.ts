/**
 * Pure constants + types for the per-job status field. Kept separate from
 * `src/server/status.ts` so that route components can import the labels
 * without dragging the DB module into the client bundle.
 */

export const JOB_STATUS_VALUES = [
  'new',
  'not_considered',
  'selected',
  'applied',
  'rejected',
  'further_steps',
] as const;

export type JobStatusValue = (typeof JOB_STATUS_VALUES)[number];

export const JOB_STATUS_LABELS: Record<JobStatusValue, string> = {
  new: 'New',
  not_considered: 'Not considered',
  selected: 'Selected',
  applied: 'Applied',
  rejected: 'Rejected',
  further_steps: 'Further steps',
};
