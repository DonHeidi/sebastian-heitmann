import { cn } from '@/lib/utils';

export interface LanguagePickerLink {
  code: string;
  label: string;
  href: string;
  active: boolean;
}

export interface LanguagePickerProps {
  links: LanguagePickerLink[];
  label: string;
}

// Static component — no hydration needed. The only client-side behavior the
// old navigation.astro attached was "remember the manually-picked locale so
// the first-visit redirect script in Layout.astro doesn't fire again";
// that's a one-line side effect with no reactive state, so it ships as a
// plain inline <script> in the static HTML output instead of promoting this
// to a React island.
export function LanguagePicker({ links, label }: LanguagePickerProps) {
  return (
    <div className="flex border border-border" role="navigation" aria-label={label}>
      {links.map((link, index) => (
        <a
          key={link.code}
          className={cn(
            'flex items-center justify-center px-2 py-1.5 font-mono text-[0.625rem] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:text-primary',
            index !== links.length - 1 && 'border-r border-border',
            link.active && 'bg-surface text-primary'
          )}
          href={link.href}
          data-lang-link
          data-locale={link.code}
          aria-current={link.active ? 'page' : undefined}
        >
          {link.label}
        </a>
      ))}
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html:
            "document.querySelectorAll('[data-lang-link]').forEach(function(el){el.addEventListener('click',function(){var locale=el.getAttribute('data-locale');if(locale){localStorage.setItem('locale',locale);}});});",
        }}
      />
    </div>
  );
}
