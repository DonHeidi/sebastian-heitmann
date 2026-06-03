import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import {
  fetchFeedback,
  fetchJob,
  fetchJobStatus,
  fetchOutreach,
} from '../../server/content';
import { formatDate } from '../../lib/format';
import { FeedbackForm } from '../../components/feedback-form';
import { OutreachForm } from '../../components/outreach-form';
import { StatusSelector } from '../../components/status-selector';
import styles from './$slug.module.scss';

const fitLabel: Record<string, string> = {
  top: 'Top match',
  borderline: 'Borderline',
  skip: 'Skip',
};

export const Route = createFileRoute('/jobs/$slug')({
  loader: async ({ params }) => {
    const [job, feedback, outreach, status] = await Promise.all([
      fetchJob({ data: params.slug }),
      fetchFeedback({ data: params.slug }),
      fetchOutreach({ data: params.slug }),
      fetchJobStatus({ data: params.slug }),
    ]);
    if (!job) throw notFound();
    return { job, feedback, outreach, status };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { job } = loaderData;
    return {
      meta: [
        { title: `${job.title} — ${job.company}` },
        {
          name: 'description',
          content: `${job.title} at ${job.company}.`,
        },
      ],
    };
  },
  component: JobDetail,
});

function JobDetail() {
  const { job, feedback, outreach, status } = Route.useLoaderData();
  const fitClass = job.fit
    ? job.fit === 'top'
      ? styles.fitTop
      : job.fit === 'borderline'
      ? styles.fitBorderline
      : styles.fitSkip
    : styles.fit;

  return (
    <main className={styles.page}>
      <Link className={styles.back} to="/jobs">← All jobs</Link>

      <header className={styles.header}>
        {job.fit && <p className={fitClass}>{fitLabel[job.fit]}</p>}
        <h1 className={styles.title}>{job.title}</h1>
        <p className={styles.meta}>
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
          {job.posted_at && (
            <>
              <span className={styles.dot}>·</span>
              <time dateTime={job.posted_at}>{formatDate(job.posted_at)}</time>
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
        <a className={styles.apply} href={job.url} target="_blank" rel="noopener">
          View original posting →
        </a>

        <StatusSelector
          jobId={job.id}
          current={status.status}
          updatedAt={status.updated_at}
        />
      </header>

      <section
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: job.html }}
      />

      <OutreachForm
        jobId={job.id}
        initialBody={outreach?.body ?? ''}
        initialHtml={outreach?.html ?? ''}
        updatedAt={outreach?.updated_at ?? null}
      />

      <FeedbackForm
        jobId={job.id}
        initialBody={feedback?.body ?? ''}
        updatedAt={feedback?.updated_at ?? null}
      />
    </main>
  );
}
