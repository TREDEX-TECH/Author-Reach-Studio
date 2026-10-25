'use client';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
    setTheme(current); setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem('ars-theme', next); } catch { /* storage unavailable */ }
    setTheme(next);
  }

  return (
    <button type="button" className={`theme-toggle ${className}`} onClick={toggle}
      aria-label={mounted && theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={mounted && theme === 'dark' ? 'Light mode' : 'Dark mode'}>
      {mounted && theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
