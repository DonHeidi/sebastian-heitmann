/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import {
  Outlet,
  Link,
  useRouterState,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import '../styles/global.scss';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#0C0C0C' },
      { title: 'Job Directory' },
      { name: 'description', content: 'Curated jobs and freelance briefs.' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      {
        rel: 'preload',
        href: '/fonts/InstrumentSerif-Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/DMSans-Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/IBMPlexMono-Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
    scripts: [
      {
        children: `(function() {
  var stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    document.documentElement.classList.add(stored);
  } else {
    document.documentElement.classList.add(
      window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    );
  }
})();`,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <SiteNav />
      <Outlet />
    </RootDocument>
  );
}

function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isBriefings = pathname === '/briefings' || pathname.startsWith('/briefings/');
  const isJobs = pathname === '/jobs' || pathname.startsWith('/jobs/');

  return (
    <nav className="site-nav" aria-label="Primary">
      <div className="site-nav__inner">
        <Link className="site-nav__brand" to="/">Job Directory</Link>
        <ul className="site-nav__links">
          <li>
            <Link
              to="/briefings"
              className={
                'site-nav__link' + (isBriefings ? ' site-nav__link--active' : '')
              }
              aria-current={isBriefings ? 'page' : undefined}
            >
              Briefings
            </Link>
          </li>
          <li>
            <Link
              to="/jobs"
              className={
                'site-nav__link' + (isJobs ? ' site-nav__link--active' : '')
              }
              aria-current={isJobs ? 'page' : undefined}
            >
              Jobs
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
