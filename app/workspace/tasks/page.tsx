import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, EmptyState } from '@/components/ui';
import { tasks } from '@/lib/demo-data';
export default function WorkspaceTasks(){
  return <>
    <AppHead title="My tasks" subtitle="Each task has an owner, a status and an associated project."
      action={<Link href="/workspace/tasks" className="btn btn-outline btn-sm">Board view</Link>}/>
    <KpiRow items={[{label:'Total assigned',value:'5'},{label:'In progress',value:'1'},{label:'In review',value:'1'},{label:'Blocked / changes',value:'1',delta:'Needs action',negative:true}]}/>
    <Panel title="Task list" flush>
      <SimpleTable columns={['ID','Task','Project','Due','Priority','Status','']} rows={tasks.map(t=>[
        <span className="small faint">{t.id}</span>,
        <span><strong>{t.title}</strong></span>, t.project, t.due,
        <Badge tone={t.priority==='Urgent'?'danger':t.priority==='High'?'warn':'neutral'}>{t.priority}</Badge>,
        <Badge tone={t.tone}>{t.status}</Badge>,
        <Link href="/workspace/tasks" className="btn btn-outline btn-sm">Open</Link>,
      ])}/>
    </Panel>
    <div className="split">
      <Panel title="Task status workflow">
        <div className="row" style={{gap:6}}>
          {['Backlog','To Do','In Progress','In Review','Changes Requested','Approved','Completed'].map((s,i)=>(
            <span key={s} className="badge badge-neutral" style={{fontSize:'.7rem'}}>{s}{i<6&&<span style={{marginLeft:6}}>→</span>}</span>
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
