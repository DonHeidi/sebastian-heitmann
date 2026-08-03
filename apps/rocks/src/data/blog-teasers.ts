import type { Locale } from '../i18n/utils';

export interface BlogTeaser {
  title: string;
  teaser: string;
  url: string;
}

const DEV = 'https://www.sebastian-heitmann.dev';

export const blogTeasers: Record<Locale, BlogTeaser[]> = {
  'en-us': [
    {
      title: 'Software development is becoming a management discipline',
      teaser: 'What changes when the bottleneck moves from writing code to directing the systems that write it.',
      url: `${DEV}/articles/software-development-is-becoming-a-management-discipline/`,
    },
    {
      title: "Your knowledge system isn't finished until it ships",
      teaser: 'Notes that never leave the vault are drafts. On closing the loop between collecting and publishing.',
      url: `${DEV}/articles/your-knowledge-system-isnt-finished-until-it-ships/`,
    },
    {
      title: "Why your AI-written strategy isn't a strategy",
      teaser: 'A strategy you did not think through yourself is a document, not a decision.',
      url: `${DEV}/articles/why-your-ai-written-strategy-isnt-a-strategy/`,
    },
  ],
  'de-de': [
    {
      title: 'Softwareentwicklung wird zur Management-Disziplin',
      teaser: 'Was sich ändert, wenn der Engpass nicht mehr das Schreiben von Code ist, sondern das Steuern der Systeme, die ihn schreiben.',
      url: `${DEV}/de-de/articles/software-development-is-becoming-a-management-discipline/`,
    },
    {
      title: 'Dein Wissenssystem ist erst fertig, wenn es liefert',
      teaser: 'Notizen, die den Vault nie verlassen, sind Entwürfe. Über das Schließen der Lücke zwischen Sammeln und Veröffentlichen.',
      url: `${DEV}/de-de/articles/your-knowledge-system-isnt-finished-until-it-ships/`,
    },
    {
      title: 'Warum deine KI-geschriebene Strategie keine Strategie ist',
      teaser: 'Eine Strategie, die du nicht selbst durchdacht hast, ist ein Dokument, keine Entscheidung.',
      url: `${DEV}/de-de/articles/why-your-ai-written-strategy-isnt-a-strategy/`,
    },
  ],
};
