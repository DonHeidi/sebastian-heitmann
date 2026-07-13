import { Mail } from 'lucide-react';
import { SiBluesky, SiGithub, SiInstagram, SiMastodon, SiThreads, SiX, SiYoutube } from '@icons-pack/react-simple-icons';

export interface AuthorCardProps {
  name: string;
  role: string;
  description: string;
  avatarSrc: string;
  email?: string;
  socials?: Array<{ platform: string; url: string }>;
}

// simple-icons removed the LinkedIn mark from published packages (trademark policy).
// Path below is the last-published glyph, sourced from the still-installed
// @iconify-json/simple-icons dataset, so the rendered icon matches the old
// astro-icon output exactly.
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={16} height={16} className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    </svg>
  );
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
