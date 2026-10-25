import Link from 'next/link';
import type { ReactNode, CSSProperties } from 'react';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Panel({ title, action, children, flush = false }: {
  title: string; action?: ReactNode; children: ReactNode; flush?: boolean;
}) {
  return (
    <section className="panel">
      <div className="panel-head"><h3>{title}</h3>{action}</div>
      <div className={`panel-body${flush ? ' flush' : ''}`}>{children}</div>
    </section>
  );
}

export function Kpi({ label, value, delta, negative = false, icon, iconTone = '' }: {
  label: string; value: string; delta?: string; negative?: boolean; icon?: string; iconTone?: string;
}) {
  return (
    <div className="kpi">
      {icon && <span className={`kpi-icon ${iconTone}`} aria-hidden="true">{icon}</span>}
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta ? <div className={`delta${negative ? ' neg' : ''}`}>{delta}</div>
             : <div className="delta" style={{color:'var(--faint)'}}>&nbsp;</div>}
    </div>
  );
}

export function Progress({ value, tone = '' }: { value: number; tone?: string }) {
  return <div className={`progress ${tone}`}><i style={{width:`${Math.min(100,Math.max(0,value))}%`}} /></div>;
}

export function Ring({ value }: { value: number }) {
  return <div className="ring" style={{'--v':value} as CSSProperties} data-label={`${value}%`} />;
}

export function EmptyState({ icon = '◇', title, body, action }: {
  icon?: string; title: string; body: string; action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="em-ico">{icon}</div><h4>{title}</h4><p>{body}</p>{action}
    </div>
  );
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="breadcrumbs">
      <Link href="/">Home</Link>
      {items.map((it,i) => (
        <span key={i} style={{display:'inline-flex',gap:8}}><span>/</span>
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span>{it.label}</span>}</span>
      ))}
    </div>
  );
}

export function PageHero({ eyebrow, title, lead, crumbs }: {
  eyebrow: string; title: string; lead: string; crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="page-hero">
      <div className="container">
        {crumbs && <Crumbs items={crumbs} />}
        <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lead">{lead}</p>
      </div>
    </section>
  );
}

export function HeroBanner({ title, text, action, ring }: {
  title: string; text: string; action?: ReactNode; ring?: number;
}) {
  return (
    <div className="hero-banner">
      <div className="spread">
        <div><h2>{title}</h2><p>{text}</p>{action && <div className="row" style={{marginTop:16}}>{action}</div>}</div>
        {ring !== undefined && <Ring value={ring} />}
      </div>
    </div>
  );
}

export function QuickActions({ items }: { items:{ href:string; icon:string; label:string; sub:string }[] }) {
  return (
    <div className="quick-grid">
      {items.map(i => (
        <Link href={i.href} className="quick-card" key={i.label}>
          <span className="qi">{i.icon}</span>
          <span><b>{i.label}</b><span>{i.sub}</span></span>
        </Link>
      ))}
    </div>
  );
}
