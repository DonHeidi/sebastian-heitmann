import { createServerFn } from '@tanstack/react-start';
import {
  listJobs as listJobRows,
  getJobRow,
  listBriefings as listBriefingRows,
  getBriefingRow,
} from '../db/repo';
import {
  rowToBriefing,
  rowToJob,
  type BriefingView,
  type JobView,
} from './views';
import {
  addToShortlist,
  listShortlist,
  removeFromShortlist,
  type AddResult,
  type RemoveResult,
  type ShortlistEntry,
} from './shortlist';
import {
  clearFeedback,
  getFeedback,
  setFeedback,
  type ClearResult as FeedbackClearResult,
  type Feedback,
  type SaveResult as FeedbackSaveResult,
} from './feedback';
import {
  clearOutreach,
  getOutreach,
  setOutreach,
  type ClearResult as OutreachClearResult,
  type Outreach,
  type SaveResult as OutreachSaveResult,
} from './outreach';
import {
  clearStatus,
  getStatus,
  listAllStatuses,
  setStatus,
  type ClearResult as StatusClearResult,
  type JobStatus,
  type JobStatusValue,
  type SaveResult as StatusSaveResult,
} from './status';

export type {
  JobView,
  BriefingView,
  ShortlistEntry,
  Feedback,
  Outreach,
  JobStatus,
  JobStatusValue,
};

export const fetchJobs = createServerFn({ method: 'GET' }).handler(() => {
  return listJobRows().map(rowToJob);
});

export const fetchJob = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(({ data }): JobView | null => {
    const row = getJobRow(data);
    return row ? rowToJob(row) : null;
  });

export const fetchBriefings = createServerFn({ method: 'GET' }).handler(() => {
  return listBriefingRows().map(rowToBriefing);
});

export const fetchBriefing = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(({ data }): BriefingView | null => {
    const row = getBriefingRow(data);
    return row ? rowToBriefing(row) : null;
  });

export const fetchShortlist = createServerFn({ method: 'GET' }).handler(
  (): ShortlistEntry[] => listShortlist(),
);

export const shortlistJob = createServerFn({ method: 'POST' })
  .inputValidator((jobId: string) => jobId)
  .handler(({ data }): AddResult => addToShortlist(data));

export const unshortlistJob = createServerFn({ method: 'POST' })
  .inputValidator((jobId: string) => jobId)
  .handler(({ data }): RemoveResult => removeFromShortlist(data));

export const fetchFeedback = createServerFn({ method: 'GET' })
  .inputValidator((jobId: string) => jobId)
  .handler(({ data }): Feedback | null => getFeedback(data));

export const saveFeedback = createServerFn({ method: 'POST' })
  .inputValidator((input: { job_id: string; body: string }) => input)
  .handler(
    ({ data }): FeedbackSaveResult => setFeedback(data.job_id, data.body),
  );

export const removeFeedback = createServerFn({ method: 'POST' })
  .inputValidator((jobId: string) => jobId)
  .handler(({ data }): FeedbackClearResult => clearFeedback(data));

export const fetchOutreach = createServerFn({ method: 'GET' })
  .inputValidator((jobId: string) => jobId)
  .handler(({ data }): Outreach | null => getOutreach(data));

export const saveOutreach = createServerFn({ method: 'POST' })
  .inputValidator((input: { job_id: string; body: string }) => input)
  .handler(
    ({ data }): OutreachSaveResult => setOutreach(data.job_id, data.body),
  );

export const removeOutreach = createServerFn({ method: 'POST' })
  .inputValidator((jobId: string) => jobId)
  .handler(({ data }): OutreachClearResult => clearOutreach(data));

export const fetchJobStatus = createServerFn({ method: 'GET' })
  .inputValidator((jobId: string) => jobId)
  .handler(({ data }): JobStatus => getStatus(data));

export const fetchAllJobStatuses = createServerFn({ method: 'GET' }).handler(
  (): Record<string, JobStatusValue> => listAllStatuses(),
);

export const saveJobStatus = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: { job_id: string; status: JobStatusValue }) => input,
  )
  .handler(
    ({ data }): StatusSaveResult => setStatus(data.job_id, data.status),
  );

export const removeJobStatus = createServerFn({ method: 'POST' })
  .inputValidator((jobId: string) => jobId)
  .handler(({ data }): StatusClearResult => clearStatus(data));
