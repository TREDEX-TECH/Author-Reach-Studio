import type { ReactNode } from 'react';
import { Badge, EmptyState, Kpi, Panel } from './ui';

export function AppHead({ title, subtitle, action }: { title:string; subtitle:string; action?:ReactNode }) {
  return <div className="app-head"><div><h2>{title}</h2><p>{subtitle}</p></div>{action && <div className="row">{action}</div>}</div>;
}

export type Row = ReactNode[];
export function SimpleTable({ columns, rows, empty }: { columns:string[]; rows:Row[]; empty?:{title:string;body:string} }) {
  if (!rows.length && empty) return <EmptyState title={empty.title} body={empty.body} />;
  return (
    <div className="table-wrap"><table>
      <thead><tr>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody>
    </table></div>
  );
}

export type KpiItem = {label:string;value:string;delta?:string;negative?:boolean;icon?:string;iconTone?:string};
export function KpiRow({ items }: { items:KpiItem[] }) {
  return <div className="kpis">{items.map((i,n)=><Kpi key={i.label} {...i} icon={i.icon ?? ['◧','◈','▥','✓'][n%4]} iconTone={i.iconTone ?? ['','blue','green','violet'][n%4]}/>)}</div>;
}

export function ModuleView({ title, subtitle, action, kpis, panelTitle, panelAction, columns, rows, empty, side, notice }: {
  title:string; subtitle:string; action?:ReactNode; kpis?:KpiItem[];
  panelTitle:string; panelAction?:ReactNode; columns:string[]; rows:Row[];
  empty?:{title:string;body:string}; side?:ReactNode; notice?:ReactNode;
}) {
  return (
    <>
      <AppHead title={title} subtitle={subtitle} action={action}/>
      {notice}{kpis && <KpiRow items={kpis}/>}
      <div className={side ? 'split' : ''}>
        <Panel title={panelTitle} action={panelAction} flush><SimpleTable columns={columns} rows={rows} empty={empty}/></Panel>
        {side}
      </div>
    </>
  );
}

export function StatusBadge({ label, tone }: { label:string; tone:string }) {
  return <Badge tone={tone}>{label}</Badge>;
}
