import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Strings } from '@/i18n/types';

export interface ContactFormProps {
  strings: Pick<
    Strings['contact'],
    | 'nameLabel'
    | 'emailLabel'
    | 'contextLabel'
    | 'contextPlaceholder'
    | 'messageLabel'
    | 'submitLabel'
    | 'sendingLabel'
    | 'successMessage'
    | 'errorMessage'
  >;
  /** Resolved `import.meta.env.PUBLIC_MAIL_ENDPOINT` from the calling `.astro`
   *  frontmatter — empty in local dev, where submitting is expected to
   *  immediately surface the error state (see old contact-section.astro). */
  endpoint: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

// Underline-input look shared by all fields, replacing the old `.form-input`
// SCSS (transparent background, bottom border only, no radius/padding-x).
const fieldClasses =
  'border-0 border-b border-input rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary';

export function ContactForm({ strings, endpoint }: ContactFormProps) {
  const [status, setStatus] = React.useState<Status>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!endpoint) {
      setStatus('error');
      return;
    }

    setStatus('sending');

    const formData = new FormData(form);
    const payload: Record<string, string> = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };
    const context = String(formData.get('context') ?? '');
    if (context) payload.context = context;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cf-name">{strings.nameLabel}</Label>
          <Input id="cf-name" name="name" type="text" required autoComplete="name" className={fieldClasses} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cf-email">{strings.emailLabel}</Label>
          <Input id="cf-email" name="email" type="email" required autoComplete="email" className={fieldClasses} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cf-context">{strings.contextLabel}</Label>
        <Input
          id="cf-context"
          name="context"
          type="text"
          placeholder={strings.contextPlaceholder}
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cf-message">{strings.messageLabel}</Label>
        <Textarea id="cf-message" name="message" rows={4} required className={cn(fieldClasses, 'min-h-[100px] resize-y')} />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Button
          type="submit"
          disabled={status === 'sending'}
          variant="ghost"
          className="group h-auto min-w-0 shrink-0 gap-3 self-start rounded-none border-0 border-b border-primary px-0 py-4 font-mono text-xs tracking-[0.08em] text-foreground uppercase transition-[gap] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:gap-5 hover:bg-transparent"
        >
          {status === 'sending' ? strings.sendingLabel : strings.submitLabel}
          <ArrowRight
            aria-hidden="true"
            className="size-4 text-primary transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          />
        </Button>
        <p
          aria-live="polite"
          className={
            status === 'success'
              ? 'font-mono text-[11px] tracking-[0.02em] text-success'
              : status === 'error'
                ? 'font-mono text-[11px] tracking-[0.02em] text-destructive'
                : 'sr-only'
          }
        >
          {status === 'success' ? strings.successMessage : status === 'error' ? strings.errorMessage : ''}
        </p>
      </div>
    </form>
  );
}
