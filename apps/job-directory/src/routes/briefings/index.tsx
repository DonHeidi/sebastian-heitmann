import { createFileRoute, Link } from '@tanstack/react-router';
import { fetchBriefings } from '../../server/content';
import { formatDate } from '../../lib/format';
import styles from './index.module.scss';

export const Route = createFileRoute('/briefings/')({
  head: () => ({
    meta: [
      { title: 'Briefings — Job Directory' },
      { name: 'description', content: 'Curator briefings for each scan run.' },
    ],
  }),
  loader: async () => {
    const briefings = await fetchBriefings();
    return { briefings };
  },
  component: BriefingsIndex,
});

function BriefingsIndex() {
  const { briefings } = Route.useLoaderData();

  return (
    <main className={styles.page}>
      <Link className={styles.back} to="/">← Job directory</Link>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Curated by agent</p>
        <h1 className={styles.title}>Briefings</h1>
        <p className={styles.lede}>
          Curator notes summarising each scan run — top candidates, borderline matches,
          and noise to ignore.
        </p>
      </header>

      {briefings.length === 0 ? (
        <p className={styles.empty}>No briefings yet.</p>
      ) : (
        <ul className={styles.list}>
          {briefings.map((entry) => (
            <li key={entry.id} className={styles.item}>
              <Link
                className={styles.itemLink}
                to="/briefings/$slug"
                params={{ slug: entry.id }}
              >
                <time className={styles.itemDate} dateTime={entry.date}>
                  {formatDate(entry.date)}
                </time>
                <span className={styles.itemLabel}>briefing</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
