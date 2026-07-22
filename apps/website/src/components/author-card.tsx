import { Mail } from 'lucide-react';
import { SiBluesky, SiGithub, SiInstagram, SiMastodon, SiThreads, SiX, SiYoutube } from '@icons-pack/react-simple-icons';
import { LinkedInIcon } from './social-icons';
import { cn } from '@/lib/utils';

export interface AuthorCardProps {
  name: string;
  role: string;
  description: string;
  avatarSrc: string;
  email?: string;
  socials?: Array<{ platform: string; url: string }>;
  className?: string;
  /** Collapses to a compact horizontal strip (avatar + name/role only) below the `md` breakpoint. */
  compactOnMobile?: boolean;
}

const socialIcons: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  linkedin: LinkedInIcon,
  x: SiX,
  twitter: SiX,
  github: SiGithub,
  bluesky: SiBluesky,
  mastodon: SiMastodon,
  threads: SiThreads,
  youtube: SiYoutube,
  instagram: SiInstagram,
};

export function AuthorCard({
  name,
  role,
  description,
  avatarSrc,
  email,
  socials = [],
  className,
  compactOnMobile = false,
}: AuthorCardProps) {
  return (
    <aside
      className={cn(
        'flex flex-col gap-3 border border-border p-6',
        compactOnMobile && 'max-md:grid max-md:grid-cols-[40px_1fr] max-md:items-center max-md:gap-x-3 max-md:gap-y-0.5 max-md:border-0 max-md:p-0',
        className
      )}
    >
      <div
        className={cn(
          'size-[72px] shrink-0 overflow-hidden',
          compactOnMobile && 'max-md:row-span-2 max-md:size-10'
        )}
      >
        <img
          src={avatarSrc}
          alt={name}
          className={cn(
            'size-[72px] object-cover transition-[filter] duration-400 [filter:var(--v8-photo-filter)] hover:[filter:var(--v8-photo-filter-hover)]',
            compactOnMobile && 'max-md:size-10'
          )}
        />
      </div>

      <p
        className={cn(
          'mt-1 font-display text-xl leading-tight text-foreground',
          compactOnMobile && 'max-md:mt-0 max-md:self-end max-md:text-[15px] max-md:leading-tight'
        )}
      >
        {name}
      </p>
      <p
        className={cn(
          'font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase',
          compactOnMobile && 'max-md:self-start max-md:text-[10px]'
        )}
      >
        {role}
      </p>
      <p
        className={cn(
          'text-sm leading-relaxed font-light text-text-secondary',
          compactOnMobile && 'max-md:hidden'
        )}
      >
        {description}
      </p>

      {(socials.length > 0 || email) && (
        <div className={cn('mt-1 flex gap-3.5', compactOnMobile && 'max-md:hidden')}>
          {socials.map(({ platform, url }) => {
            const Icon = socialIcons[platform];
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform}
                className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {Icon && <Icon size={16} color="currentColor" />}
              </a>
            );
          })}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail size={16} />
            </a>
          )}
        </div>
      )}
    </aside>
  );
}
