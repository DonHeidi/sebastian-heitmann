import { Mail } from 'lucide-react';
import { SiBluesky, SiGithub, SiInstagram, SiMastodon, SiThreads, SiX, SiYoutube } from '@icons-pack/react-simple-icons';
import { LinkedInIcon } from './social-icons';

export interface AuthorCardProps {
  name: string;
  role: string;
  description: string;
  avatarSrc: string;
  email?: string;
  socials?: Array<{ platform: string; url: string }>;
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

export function AuthorCard({ name, role, description, avatarSrc, email, socials = [] }: AuthorCardProps) {
  return (
    <aside className="author-card flex flex-col gap-3 border border-border p-6">
      <div className="author-card__avatar-wrap size-[72px] shrink-0 overflow-hidden">
        <img
          src={avatarSrc}
          alt={name}
          className="author-card__avatar size-[72px] object-cover transition-[filter] duration-400 [filter:var(--v8-photo-filter)] hover:[filter:var(--v8-photo-filter-hover)]"
        />
      </div>

      <p className="author-card__name mt-1 font-display text-xl leading-tight text-foreground">{name}</p>
      <p className="author-card__role font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
        {role}
      </p>
      <p className="author-card__description text-sm leading-relaxed font-light text-text-secondary">
        {description}
      </p>

      {(socials.length > 0 || email) && (
        <div className="author-card__socials mt-1 flex gap-3.5">
          {socials.map(({ platform, url }) => {
            const Icon = socialIcons[platform];
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform}
                className="author-card__social-link flex items-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {Icon && <Icon size={16} color="currentColor" />}
              </a>
            );
          })}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="author-card__social-link flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail size={16} />
            </a>
          )}
        </div>
      )}
    </aside>
  );
}
