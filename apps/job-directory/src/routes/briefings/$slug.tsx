import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { fetchBriefing } from '../../server/content';
import { formatDate } from '../../lib/format';
import styles from './$slug.module.scss';

export const Route = createFileRoute('/briefings/$slug')({
  loader: async ({ params }) => {
    const entry = await fetchBriefing({ data: params.slug });
    if (!entry) throw notFound();
    return { entry };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const label = formatDate(loaderData.entry.date);
    return {
      meta: [
        { title: `Briefing ${label} — Job Directory` },
        { name: 'description', content: `Curator briefing from ${label}.` },
      ],
    };
  },
  component: BriefingDetail,
});

function BriefingDetail() {
  const { entry } = Route.useLoaderData();
  return (
    <main className={styles.page}>
      <Link className={styles.back} to="/briefings">← All briefings</Link>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Briefing</p>
        <h1 className={styles.title}>
          <time dateTime={entry.date}>{formatDate(entry.date)}</time>
        </h1>
      </header>

      <section
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: entry.html }}
      />
    </main>
  );
}
