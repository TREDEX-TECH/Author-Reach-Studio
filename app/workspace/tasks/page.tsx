import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function WorkspaceTasks(){
  const s = await getSnapshot();
  const rows = s.tasks.map(t=>[
    <span className="small faint">{t.id.slice(0,8).toUpperCase()}</span>,
    <span><strong>{t.title}</strong>{t.requiresReview ? <span className="sub">Requires review</span> : null}</span>,
    t.project, t.due,
    <Badge tone={t.priority==='Urgent'?'danger':t.priority==='High'?'warn':'neutral'}>{t.priority}</Badge>,
    <Badge tone={t.tone}>{t.status}</Badge>,
  ]);
  return <>
    <AppHead title="Tasks" subtitle="Tasks your role is permitted to see, with owners, due dates and review requirements."/>
    <KpiRow items={[
      {label:'Visible tasks',value:String(s.counts.tasks)},
      {label:'In progress',value:String(s.tasks.filter(t=>/progress/i.test(t.status)).length)},
      {label:'In review',value:String(s.tasks.filter(t=>/review/i.test(t.status)).length)},
      {label:'Require review',value:String(s.tasks.filter(t=>t.requiresReview).length)},
    ]}/>
    <Panel title="Task list" flush><SimpleTable columns={['Ref','Task','Project','Due','Priority','Status']} rows={rows}
      empty={{title:'No tasks yet',body:'Tasks created and assigned in the database appear here. An empty list means there is no work assigned to a role you can see — we do not display sample tasks.'}}/></Panel>
    <div className="split">
      <Panel title="Task status workflow">
        <div className="row" style={{gap:6}}>
          {['Backlog','To Do','In Progress','In Review','Changes Requested','Approved','Completed'].map((x,i)=>(
            <span key={x} className="badge badge-neutral" style={{fontSize:'.7rem'}}>{x}{i<6&&<span style={{marginLeft:6}}>→</span>}</span>
          ))}
        </div>
        <div className="notice" style={{marginTop:18,fontSize:'.82rem'}}><strong>Upload ≠ completion.</strong> A task that requires review stays in “In Review” until an authorised reviewer approves it. Deliverable versions and the approval decision are both recorded.</div>
      </Panel>
      <Panel title="Internal vs client-visible">
        <div className="metric-row"><span>Internal work notes</span><Badge tone="neutral">Team only</Badge></div>
        <div className="metric-row"><span>Drafts pending review</span><Badge tone="neutral">Team only</Badge></div>
        <div className="metric-row"><span>Approved deliverables</span><Badge tone="ok">Client visible</Badge></div>
        <div className="metric-row"><span>Client feedback</span><Badge tone="info">Shared</Badge></div>
      </Panel>
    </div>
  </>;
}
