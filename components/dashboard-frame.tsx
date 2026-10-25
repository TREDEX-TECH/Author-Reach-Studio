'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AppShell } from './app-shell';
import type { NavGroup } from '@/lib/navigation';

export function DashboardFrame({ nav, roleArea, person, areaLabel, children }: {
  nav: NavGroup[]; roleArea:'portal'|'workspace'|'admin'; person:{name:string;initials:string;role:string};
  areaLabel:string; children: ReactNode;
}) {
  const pathname = usePathname();
  const all = nav.flatMap(g => g.items);
  let best = all.find(i => i.href === pathname);
  if (!best) best = [...all].sort((a,b)=>b.href.length-a.href.length).find(i => pathname.startsWith(i.href + '/'));
  const title = best?.label ?? 'Overview';
  return (
    <AppShell nav={nav} title={title} crumb={`${areaLabel} / ${title}`}
      person={person} roleArea={roleArea}>
      {children}
    </AppShell>
  );
}
