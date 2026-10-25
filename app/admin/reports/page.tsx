import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, Progress } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
import { money } from '@/lib/format';
export default async function AdminReports(){
  const s = await getSnapshot();
  const categories = Array.from(new Set(s.services.map(x=>x.category)));
  const rows = categories.map(c=>[
    <strong>{c}</strong>,
    String(s.services.filter(x=>x.category===c).length),
    <div style={{minWidth:100}}><Progress value={s.services.length ? Math.round(s.services.filter(x=>x.category===c).length / s.services.length * 100) : 0}/></div>,
    <span className="small faint">{s.services.length ? Math.round(s.services.filter(x=>x.category===c).length / s.services.length * 100) : 0}% of catalogue</span>,
  ]);
  return <>
    <AppHead title="Reports" subtitle="Operational, financial and campaign reporting — visible according to the caller’s permissions."/>
    <KpiRow items={[
      {label:'Enquiries',value:String(s.counts.inquiries)},
      {label:'Clients',value:String(s.counts.authors)},
      {label:'Verified revenue',value:money(s.counts.verifiedRevenue)},
      {label:'Projects completed',value:String(s.projects.filter(p=>/completed/i.test(p.status)).length)},
    ]}/>
    <div className="split">
      <Panel title="Published catalogue by category" flush><SimpleTable columns={['Category','Services','Share','Basis']} rows={rows}
        empty={{title:'No reporting data yet',body:'Reports are calculated from live records. An empty database produces an empty report rather than an illustrative chart or invented trend.'}}/></Panel>
      <Panel title="Who sees what">
        <div className="metric-row"><span>Executive / owner</span><strong>Full</strong></div>
        <div className="metric-row"><span>Finance officer</span><strong>Financial only</strong></div>
        <div className="metric-row"><span>Department head</span><strong>Own department</strong></div>
        <div className="metric-row"><span>Project manager</span><strong>Own projects</strong></div>
        <div className="metric-row"><span>Team member</span><strong>Own tasks</strong></div>
        <div className="metric-row"><span>Author / client</span><strong>Own records</strong></div>
        <div className="metric-row"><span>Anonymous visitor</span><Badge tone="neutral">Public records only</Badge></div>
      </Panel>
    </div>
    <Panel title="Campaign reporting standard">
      <div className="grid grid-4">
        {[
          ['Work completed','Deliverables and tasks recorded in the project.'],
          ['Campaign activity','Assets, channels, schedule and outreach, with dates.'],
          ['Observed results','Metrics with source, date range and methodology.'],
          ['External outcomes','Sales / rankings / visibility — labelled as platform-reported, never implied as caused by us.'],
        ].map(([t,b])=><div className="card" key={t} style={{padding:16}}><h4>{t}</h4><p style={{fontSize:'.83rem'}}>{b}</p></div>)}
      </div>
      <div className="notice" style={{marginTop:18,fontSize:'.82rem'}}><strong>Financial reports use verified data only.</strong> Figures are derived from invoice records and payment transactions with <code>status = success</code> and a non-null <code>verified_at</code> — never from a frontend checkout message.</div>
    </Panel>
  </>;
}
