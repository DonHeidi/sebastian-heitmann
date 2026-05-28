import { createFileRoute, Link } from '@tanstack/react-router';
import { fetchBriefings, fetchJobs } from '../server/content';
import { formatDate } from '../lib/format';
import styles from './index.module.scss';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Job Directory' },
      { name: 'description', content: 'Curated job postings and freelance briefs.' },
    ],
  }),
  loader: async () => {
    const [briefings, jobs] = await Promise.all([fetchBriefings(), fetchJobs()]);
    return { latest: briefings[0] ?? null, jobsCount: jobs.length };
  },
  component: HomePage,
});

function HomePage() {
  const { latest, jobsCount } = Route.useLoaderData();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Curated by agent</p>
        <h1 className={styles.title}>Job Directory</h1>
        <p className={styles.lede}>
          Job postings and freelance briefs curated by an external agent.
        </p>
      </header>

      {latest ? (
        <section className={styles.briefings} aria-label="Latest briefing">
          <article className={styles.briefing}>
            <h2 className={styles.briefingHeading}>
              <time dateTime={latest.date}>{formatDate(latest.date)}</time>
              <span className={styles.briefingLabel}>briefing</span>
            </h2>
            <div
              className={styles.briefingBody}
              dangerouslySetInnerHTML={{ __html: latest.html }}
            />
          </article>
          <p className={styles.more}>
            <Link to="/briefings">All briefings →</Link>
          </p>
        </section>
      ) : (
        <p className={styles.empty}>No briefings yet.</p>
      )}

      <p className={styles.moreJobs}>
        <Link to="/jobs">Browse all {jobsCount} jobs →</Link>
      </p>
    </main>
  );
}
