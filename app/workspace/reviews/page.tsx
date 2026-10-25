import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function WorkspaceReviews(){
  const s = await getSnapshot();
  const pending = s.deliverables.filter(d=>/review|pending/i.test(d.status));
  const approved = s.deliverables.filter(d=>/approved|accepted/i.test(d.status));
  const rows = pending.map(d=>[
    <span><strong>{d.title}</strong><span className="sub">{d.version} · {d.date}</span></span>,
    d.project, d.version, d.date, <Badge tone={d.tone}>{d.status}</Badge>,
  ]);
  return <>
    <AppHead title="Reviews" subtitle="Approve work or request changes. Every decision is recorded against a specific version."/>
    <KpiRow items={[
      {label:'Awaiting review',value:String(pending.length)},
      {label:'Approved deliverables',value:String(approved.length)},
      {label:'Tasks requiring review',value:String(s.tasks.filter(t=>t.requiresReview).length)},
      {label:'Visible deliverables',value:String(s.counts.deliverables)},
    ]}/>
    <Panel title="Deliverables awaiting review" flush><SimpleTable columns={['Deliverable','Project','Version','Submitted','Status']} rows={rows}
      empty={{title:'Nothing waiting for review',body:'Deliverable versions that require approval appear here. Uploading a file never completes a task requiring review — an authorised reviewer records the decision separately.'}}/></Panel>
    <div className="split">
      <Panel title="Review rules">
        <div className="metric-row"><span>Client-visible feedback</span><Badge tone="info">Shared</Badge></div>
        <div className="metric-row"><span>Internal feedback</span><Badge tone="neutral">Staff only</Badge></div>
        <div className="metric-row"><span>Version history</span><Badge tone="ok">Append-only</Badge></div>
        <div className="metric-row"><span>Decision audit</span><Badge tone="ok">Recorded</Badge></div>
      </Panel>
      <Panel title="Authorisation"><p className="small muted" style={{margin:0}}>Review actions are server-authorised and require a signed-in user with the right permission. This read-only view cannot approve work, because approval changes project state and must be auditable.</p></Panel>
    </div>
  </>;
}
