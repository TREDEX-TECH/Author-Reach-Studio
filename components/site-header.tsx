import Link from 'next/link';
import { ArsLogo } from './brand';
import { ThemeToggle } from './theme-toggle';
import { publicNav } from '@/lib/navigation';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Author Reach Studio">
          <ArsLogo height={52} />
        </Link>
        <nav className="nav" aria-label="Main navigation">
          {publicNav.map(n => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </nav>
        <div className="header-cta">
          <ThemeToggle />
          <Link href="/design-system" className="btn btn-outline btn-sm">Design system</Link>
          <Link href="/sign-in" className="btn btn-outline btn-sm">Client sign in</Link>
          <Link href="/contact" className="btn btn-primary btn-sm">Start a project →</Link>
        </div>
        <details className="mobile-nav">
          <summary aria-label="Open menu">☰</summary>
          <div className="mobile-menu">
            {publicNav.map(n => <Link key={n.href} href={n.href}>{n.label}</Link>)}
            <Link href="/contact">Contact</Link>
            <Link href="/sign-in">Client sign in</Link>
            <Link href="/design-system">Design system</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
