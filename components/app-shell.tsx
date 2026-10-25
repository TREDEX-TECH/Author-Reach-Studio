'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { ArsLogo } from './brand';
import { ThemeToggle } from './theme-toggle';
import type { NavGroup } from '@/lib/navigation';

const ROLES = [
  { key:'portal', label:'Client', href:'/portal' },
  { key:'workspace', label:'Team', href:'/workspace' },
  { key:'admin', label:'Admin', href:'/admin' },
];

export function AppShell({ nav, title, crumb, person, roleArea, children }: {
  nav: NavGroup[]; title: string; crumb: string; person: { name: string; initials: string; role: string };
  roleArea: 'portal' | 'workspace' | 'admin'; children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="app">
      <aside className="sidebar">
        <Link href="/" className="brand"><ArsLogo height={38} /></Link>
        {nav.map(group => (
          <div key={group.group}>
            <div className="side-group">{group.group}</div>
            {group.items.map(item => {
              const active = item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href + '/'));
              return (
                <Link key={item.href} href={item.href} className={`side-link${active ? ' active' : ''}`}>
                  <span className="ico" aria-hidden="true">{item.icon}</span>{item.label}
                </Link>
              );
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
            <span className="avatar">{person.initials}</span>
            <span><strong style={{color:'#fff',display:'block',fontSize:'.8rem'}}>{person.name}</strong>{person.role}</span>
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
            <div className="role-switch" aria-label="Switch demo interface">
              {ROLES.map(r => <Link key={r.key} href={r.href} className={roleArea === r.key ? 'active' : ''}>{r.label}</Link>)}
            </div>
            <ThemeToggle />
            <span className="avatar" style={{width:32,height:32,fontSize:'.72rem'}}>{person.initials}</span>
          </div>
        </div>
        <div className="app-content">
          <div className="notice no-print" style={{marginBottom:20,fontSize:'.8rem'}}>
            <strong>Demo workspace.</strong> All records below are fictional sample data. In the live platform these screens are powered by Supabase with row-level security, and every action is authorised on the server.
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
