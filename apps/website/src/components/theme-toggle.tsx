import * as React from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Mode = 'system' | 'light' | 'dark';

// Mirrors the old navigation.astro `applyTheme` exactly: the anti-FOUC inline
// script in Layout.astro only ever ADDS 'dark'/'light' to <html> and never
// removes anything itself, so this is the only place classes get removed.
function applyTheme(mode: Mode) {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
  if (mode === 'dark' || mode === 'light') {
    html.classList.add(mode);
  } else {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.classList.add(systemDark ? 'dark' : 'light');
  }
}

export interface ThemeToggleProps {
  labels: { system: string; light: string; dark: string };
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  // Static HTML/pre-hydration render always shows 'system' selected — the
  // stored preference can't be known until this mounts, matching the
  // anti-FOUC script which also can't paint an "active button" state.
  // Reconciled in the effect below; no hydration mismatch since the server
  // and the first client render both use 'system'.
  const [mode, setMode] = React.useState<Mode>('system');

  React.useEffect(() => {
    // Existing storage contract (see former navigation.astro inline script):
    // the key is 'theme' and the stored value can literally be 'system'
    // (it is written on every selection, never removed) — falls back to
    // 'system' only when the key is absent, exactly like the old
    // `localStorage.getItem('theme') || 'system'`.
    const stored = (localStorage.getItem('theme') as Mode | null) || 'system';
    setMode(stored);

    // Keep <html> in sync with OS theme changes while in system mode —
    // mirrors the `change` listener the old script attached once per page.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const current = (localStorage.getItem('theme') as Mode | null) || 'system';
      if (current === 'system') applyTheme('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function select(next: Mode) {
    setMode(next);
    // Always write, including the literal string 'system' — the existing
    // contract never removes the key (unlike a naive "clear on system"
    // implementation).
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => value && select(value as Mode)}
      aria-label="Theme"
      spacing={0}
      className="rounded-none border border-border bg-transparent p-0 shadow-none"
    >
      <ToggleGroupItem
        value="system"
        aria-label={labels.system}
        className="h-auto min-w-0 rounded-none px-2 py-1.5 text-muted-foreground hover:bg-transparent hover:text-primary data-[state=on]:bg-surface data-[state=on]:text-primary"
      >
        <Monitor className="size-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="light"
        aria-label={labels.light}
        className="h-auto min-w-0 rounded-none border-l border-border px-2 py-1.5 text-muted-foreground hover:bg-transparent hover:text-primary data-[state=on]:bg-surface data-[state=on]:text-primary"
      >
        <Sun className="size-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label={labels.dark}
        className="h-auto min-w-0 rounded-none border-l border-border px-2 py-1.5 text-muted-foreground hover:bg-transparent hover:text-primary data-[state=on]:bg-surface data-[state=on]:text-primary"
      >
        <Moon className="size-3.5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
