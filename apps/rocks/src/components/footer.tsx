import { SiBluesky, SiGithub } from '@icons-pack/react-simple-icons';
import { LinkedInIcon } from './social-icons';
import type { Strings } from '../i18n/types';

export interface FooterProps {
  footer: Strings['footer'];
}

const DEV = 'https://www.sebastian-heitmann.dev';

export function Footer({ footer }: FooterProps) {
  return (
    <footer className="mx-auto max-w-[1440px] border-t-2 border-primary p-6 md:py-10 md:px-20">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <span className="flex-1 font-mono text-[11px] text-muted-foreground">{footer.copyright}</span>
        <div className="flex flex-1 justify-center gap-6">
          <a href={`${DEV}/privacy`} className="font-mono text-[11px] text-muted-foreground no-underline transition-colors hover:text-foreground">
            {footer.privacyLabel}
          </a>
          <a href={`${DEV}/imprint`} className="font-mono text-[11px] text-muted-foreground no-underline transition-colors hover:text-foreground">
            {footer.imprintLabel}
          </a>
          <a href={`${DEV}/#contact`} className="font-mono text-[11px] text-muted-foreground no-underline transition-colors hover:text-foreground">
            {footer.contactLabel}
          </a>
        </div>
        <div className="flex flex-1 justify-end gap-4">
          <a href="https://www.linkedin.com/in/sebastian-heitmann/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center text-muted-foreground no-underline transition-colors hover:text-foreground">
            <LinkedInIcon size={14} />
          </a>
          <a href="https://github.com/DonHeidi" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex items-center text-muted-foreground no-underline transition-colors hover:text-foreground">
            <SiGithub size={14} color="currentColor" />
          </a>
          <a href="https://bsky.app/profile/e2e-developer.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky" className="flex items-center text-muted-foreground no-underline transition-colors hover:text-foreground">
            <SiBluesky size={14} color="currentColor" />
          </a>
        </div>
      </div>
    </footer>
  );
}
