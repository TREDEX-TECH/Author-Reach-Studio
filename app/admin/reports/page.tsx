import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, Progress } from '@/components/ui';
import { money } from '@/lib/demo-data';
export default function AdminReports(){
  return <>
    <AppHead title="Reports" subtitle="Operational, financial and campaign reporting — visible according to the caller’s permissions."/>
    <KpiRow items={[
      {label:'New inquiries (30d)',value:'23',delta:'+18%'},
      {label:'Inquiry → client',value:'34%',delta:'+4 pts'},
      {label:'Verified revenue',value:money(3850),delta:'3 payments'},
      {label:'Projects completed',value:'9',delta:'This quarter'},
    ]}/>
    <div className="split">
      <Panel title="Service performance" flush>
        <SimpleTable columns={['Service','Projects','Completion','Avg. duration']} rows={[
          ['Book discoverability','7','100%','13 days'],
          ['Promotional creative','5','80%','22 days'],
          ['Book launch campaigns','3','67%','6 weeks'],
          ['Author websites','2','50%','38 days'],
          ['A+ Content support','4','75%','20 days'],
        ].map(r=>[<strong>{r[0]}</strong>,r[1],<div style={{minWidth:90}}><Progress value={parseInt(r[2])}/></div>,r[3]])}/>
      </Panel>
      <Panel title="Who sees what">
        <div className="metric-row"><span>Executive / owner</span><strong>Full</strong></div>
        <div className="metric-row"><span>Finance officer</span><strong>Financial only</strong></div>
        <div className="metric-row"><span>Department head</span><strong>Own department</strong></div>
        <div className="metric-row"><span>Project manager</span><strong>Own projects</strong></div>
        <div className="metric-row"><span>Team member</span><strong>Own tasks</strong></div>
        <div className="metric-row"><span>Author / client</span><strong>Own records</strong></div>
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
