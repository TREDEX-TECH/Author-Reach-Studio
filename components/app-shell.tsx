'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { ArsLogo } from './brand';
import { ThemeToggle } from './theme-toggle';
import { SignOutButton } from './sign-out-button';
import { getViewer, GUEST, type Viewer } from '@/lib/auth';
import type { NavGroup } from '@/lib/navigation';

const ROLES = [
  { key:'portal', label:'Client', href:'/portal' },
  { key:'workspace', label:'Team', href:'/workspace' },
  { key:'admin', label:'Admin', href:'/admin' },
];

export function AppShell({ nav, title, crumb, person, roleArea, children }: {
  nav: NavGroup[]; title: string; crumb: string; person: { name:string; initials:string; role:string };
  roleArea: 'portal'|'workspace'|'admin'; children: ReactNode;
}) {
  const pathname = usePathname();
  const [viewer, setViewer] = useState<Viewer | null>(null);
  useEffect(() => { getViewer().then(setViewer).catch(() => setViewer(GUEST)); }, []);
  const shown = viewer?.signedIn ? viewer : person;

  return (
    <div className="app">
      <aside className="sidebar">
        <Link href="/" className="brand"><ArsLogo height={38} /></Link>
        {nav.map(group => (
          <div key={group.group}>
            <div className="side-group">{group.group}</div>
            {group.items.map(item => {
              const active = item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href + '/'));
              return <Link key={item.href} href={item.href} className={`side-link${active ? ' active' : ''}`}>
                <span className="ico" aria-hidden="true">{item.icon}</span>{item.label}</Link>;
            })}
          </div>
        ))}
        <div className="side-upgrade">
          <b>Need help with a project?</b>
          <p>Message your team directly from the portal.</p>
          <Link href="/portal/messages" className="btn btn-sm" style={{background:'var(--brand)',color:'#fff',width:'100%'}}>Open messages →</Link>
        </div>
        <div className="side-foot">
          <div className="side-user">
            <span className="avatar">{shown.initials}</span>
            <span><strong style={{color:'#fff',display:'block',fontSize:'.8rem'}}>{shown.name}</strong>{shown.role}</span>
          </div>
          <div style={{padding:'10px 10px 0'}}><Link href="/" style={{color:'var(--sidebar-muted)'}}>← Back to website</Link></div>
        </div>
      </aside>
      <div className="app-main">
        <div className="topbar">
          <div><div className="crumb">{crumb}</div><h1>{title}</h1></div>
          <div className="row" style={{gap:12}}>
            <label className="searchbar" aria-label="Search">
              <span aria-hidden="true">⌕</span>
              <input placeholder="Search projects, invoices, files…" aria-label="Search" />
            </label>
            <div className="role-switch" aria-label="Switch workspace">
              {ROLES.map(r => <Link key={r.key} href={r.href} className={roleArea === r.key ? 'active' : ''}>{r.label}</Link>)}
            </div>
            <ThemeToggle />
            {viewer?.signedIn
              ? <SignOutButton />
              : <Link href="/sign-in" className="btn btn-outline btn-sm">Sign in</Link>}
            <span className="avatar" style={{width:32,height:32,fontSize:'.72rem'}}>{shown.initials}</span>
          </div>
        </div>
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
