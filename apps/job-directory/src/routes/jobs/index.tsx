import { createFileRoute, Link } from '@tanstack/react-router';
import { fetchAllJobStatuses, fetchJobs } from '../../server/content';
import {
  JOB_STATUS_LABELS,
  type JobStatusValue,
} from '../../lib/job-status';
import { formatDate } from '../../lib/format';
import styles from './index.module.scss';

const fitOrder: Record<string, number> = { top: 0, borderline: 1, skip: 3 };
const fitLabel: Record<string, string> = {
  top: 'Top match',
  borderline: 'Borderline',
  skip: 'Skip',
};

export const Route = createFileRoute('/jobs/')({
  head: () => ({
    meta: [
      { title: 'Jobs — Job Directory' },
      { name: 'description', content: 'Curated job postings.' },
    ],
  }),
  loader: async () => {
    const [jobs, statuses] = await Promise.all([
      fetchJobs(),
      fetchAllJobStatuses(),
    ]);
    return {
      jobs: jobs.sort((a, b) => {
        const ar = a.fit ? fitOrder[a.fit] : 2;
        const br = b.fit ? fitOrder[b.fit] : 2;
        if (ar !== br) return ar - br;
        const ad = a.posted_at ? new Date(a.posted_at).getTime() : 0;
        const bd = b.posted_at ? new Date(b.posted_at).getTime() : 0;
        return bd - ad;
      }),
      statuses,
    };
  },
  component: JobsIndex,
});

function JobsIndex() {
  const { jobs, statuses } = Route.useLoaderData();

  const statusClass = (s: JobStatusValue) => {
    if (s === 'selected' || s === 'applied') return styles.statusActive;
    if (s === 'further_steps') return styles.statusGood;
    if (s === 'rejected') return styles.statusRejected;
    if (s === 'not_considered') return styles.statusMuted;
    return styles.statusNew;
  };

  const fitClass = (fit?: string | null) => {
    if (fit === 'top') return styles.jobTop;
    if (fit === 'borderline') return styles.jobBorderline;
    if (fit === 'skip') return styles.jobSkip;
    return styles.job;
  };

  const fitLabelClass = (fit: string) => {
    if (fit === 'top') return styles.fitTop;
    if (fit === 'borderline') return styles.fitBorderline;
    if (fit === 'skip') return styles.fitSkip;
    return styles.fit;
  };

  return (
    <main className={styles.page}>
      <Link className={styles.back} to="/">← Job directory</Link>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Curated by agent</p>
        <h1 className={styles.title}>Jobs</h1>
        <p className={styles.lede}>
          Every job posting and freelance brief surfaced by the scans, newest first.
        </p>
      </header>

      {jobs.length === 0 ? (
        <p className={styles.empty}>No jobs yet.</p>
      ) : (
        <ul className={styles.list}>
          {jobs.map((job) => (
            <li key={job.id} className={fitClass(job.fit)}>
              <Link
                className={styles.link}
                to="/jobs/$slug"
                params={{ slug: job.id }}
              >
                <div className={styles.head}>
                  <h2 className={styles.jobTitle}>{job.title}</h2>
                  {job.posted_at && (
                    <time className={styles.date} dateTime={job.posted_at}>
                      {formatDate(job.posted_at)}
                    </time>
                  )}
                </div>
                <p className={styles.sub}>
                  {(() => {
                    const s: JobStatusValue = statuses[job.id] ?? 'new';
                    if (s === 'new') return null;
                    return (
                      <>
                        <span className={statusClass(s)}>
                          {JOB_STATUS_LABELS[s]}
                        </span>
                        <span className={styles.dot}>·</span>
                      </>
                    );
                  })()}
                  {job.fit && (
                    <>
                      <span className={fitLabelClass(job.fit)}>
                        {fitLabel[job.fit]}
                      </span>
                      <span className={styles.dot}>·</span>
                    </>
                  )}
                  <span className={styles.company}>{job.company}</span>
                  {job.location && (
                    <>
                      <span className={styles.dot}>·</span>
                      <span>{job.location}</span>
                    </>
                  )}
                  {job.remote && (
                    <>
                      <span className={styles.dot}>·</span>
                      <span>Remote</span>
                    </>
                  )}
                </p>
                {job.tags.length > 0 && (
                  <ul className={styles.tags}>
                    {job.tags.map((t) => (
                      <li key={t} className={styles.tag}>{t}</li>
                    ))}
                  </ul>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
