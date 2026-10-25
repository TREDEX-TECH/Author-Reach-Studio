import Link from 'next/link';
import { KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, HeroBanner, QuickActions } from '@/components/ui';
import { EmptyRecords } from '@/components/empty-records';
import { getSnapshot } from '@/lib/data/live';
export default async function WorkspaceHome(){
  const s = await getSnapshot();
  const reviewing = s.tasks.filter(t=>/review/i.test(t.status));
  return <>
    <HeroBanner title="Your delivery workspace" ring={s.counts.projects ? Math.round(s.projects.reduce((a,p)=>a+p.progress,0)/s.projects.length) : 0}
      text={s.counts.tasks ? `${s.counts.tasks} tasks assigned · ${reviewing.length} awaiting internal review.` : 'Assigned tasks, projects and reviews appear here as soon as work is created.'}
      action={<Link href="/workspace/tasks" className="btn btn-sm">Open my tasks →</Link>} />
    <KpiRow items={[
      {label:'Assigned to me',value:String(s.counts.tasks)},
      {label:'Awaiting review',value:String(reviewing.length)},
      {label:'Projects',value:String(s.counts.projects)},
      {label:'Deliverables',value:String(s.counts.deliverables)},
    ]}/>
    <QuickActions items={[
      {href:'/workspace/tasks',icon:'✓',label:'My tasks',sub:`${s.counts.tasks} assigned`},
      {href:'/workspace/reviews',icon:'▨',label:'Reviews',sub:`${reviewing.length} to review`},
      {href:'/workspace/files',icon:'▧',label:'Files',sub:`${s.counts.files} stored`},
      {href:'/workspace/messages',icon:'◇',label:'Conversations',sub:`${s.conversations.length} active`},
    ]}/>
    <div className="split">
      <Panel title="My tasks" action={<Link href="/workspace/tasks" className="btn btn-ghost btn-sm">View all →</Link>} flush>
        <SimpleTable columns={['Task','Project','Due','Priority','Status']}
          rows={s.tasks.slice(0,8).map(t=>[<span><strong>{t.title}</strong><span className="sub">{t.id.slice(0,8)}</span></span>,t.project,t.due,
            <Badge tone={t.priority==='Urgent'?'danger':t.priority==='High'?'warn':'neutral'}>{t.priority}</Badge>,
            <Badge tone={t.tone}>{t.status}</Badge>])}
          empty={{title:'No tasks assigned',body:'Tasks created and assigned to your account will appear here. Nothing is shown until real work exists.'}}/>
      </Panel>
      <div>
        <Panel title="Your department">
          {s.departments.length ? s.departments.map(d=><div className="metric-row" key={d.id}><span>{d.name}</span><strong>{d.members} members</strong></div>)
            : <EmptyRecords noun="departments" />}
        </Panel>
        <Panel title="Workflow rules">
          <p className="small muted" style={{margin:0}}>Uploading a file never completes a task that requires review. An authorised reviewer must approve the version first. Internal notes stay visible to staff only.</p>
          <Link href="/workspace/reviews" className="btn btn-outline btn-sm" style={{marginTop:14}}>Go to reviews →</Link>
        </Panel>
      </div>
    </div>
  </>;
}
