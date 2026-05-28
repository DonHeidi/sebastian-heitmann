import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { fetchJob } from '../../server/content';
import { formatDate } from '../../lib/format';
import styles from './$slug.module.scss';

const fitLabel: Record<string, string> = {
  top: 'Top match',
  borderline: 'Borderline',
  skip: 'Skip',
};

export const Route = createFileRoute('/jobs/$slug')({
  loader: async ({ params }) => {
    const job = await fetchJob({ data: params.slug });
    if (!job) throw notFound();
    return { job };
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
  const { job } = Route.useLoaderData();
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
      </header>

      <section
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: job.html }}
      />
    </main>
  );
}
