import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, Progress, HeroBanner, QuickActions } from '@/components/ui';
import { tasks } from '@/lib/demo-data';
export default function WorkspaceHome(){
  return <>
    <HeroBanner title="Your week, Aisha 👋" ring={72}
      text="5 tasks assigned, 3 due this week and 1 deliverable waiting on internal review. Upload work as versions — approval is a separate step."
      action={<Link href="/workspace/tasks" className="btn btn-sm">Open my tasks →</Link>} />
    <KpiRow items={[
      {label:'Assigned to me',value:'5',delta:'Across 3 projects',icon:'◧'},
      {label:'Due this week',value:'3',delta:'1 overdue',negative:true,icon:'◷',iconTone:'red'},
      {label:'Awaiting review',value:'1',delta:'Needs a decision',icon:'✓',iconTone:'violet'},
      {label:'Changes requested',value:'1',delta:'Needs action',negative:true,icon:'↺',iconTone:'blue'},
    ]}/>
    <QuickActions items={[
      {href:'/workspace/tasks',icon:'✓',label:'My tasks',sub:'5 assigned'},
      {href:'/workspace/reviews',icon:'▨',label:'Reviews',sub:'2 to review'},
      {href:'/workspace/files',icon:'▧',label:'Upload work',sub:'Versioned files'},
      {href:'/workspace/messages',icon:'◇',label:'Conversations',sub:'Project scoped'},
    ]}/>
    <div className="split">
      <div>
        <Panel title="My tasks" action={<Link href="/workspace/tasks" className="btn btn-ghost btn-sm">View all →</Link>} flush>
          <SimpleTable columns={['Task','Project','Due','Priority','Status']} rows={tasks.slice(0,5).map(t=>[
            <span><strong>{t.title}</strong><span className="sub">{t.id}</span></span>,
            t.project, t.due, <Badge tone={t.priority==='Urgent'?'danger':t.priority==='High'?'warn':'neutral'}>{t.priority}</Badge>,
            <Badge tone={t.tone}>{t.status}</Badge>,
          ])}/>
        </Panel>
        <Panel title="Workload by project">
          {[['The Salt Road — launch',68,3],['Author platform refresh',91,1],['Ash & Ink metadata',24,1]].map(([n,v,c])=>(
            <div key={String(n)} style={{marginBottom:18}}><div className="spread" style={{marginBottom:8}}><span style={{fontSize:'.87rem',fontWeight:600}}>{n}</span><span className="small faint">{c} tasks · {v}%</span></div><Progress value={Number(v)}/></div>
          ))}
          <div className="notice" style={{fontSize:'.8rem',marginTop:20}}><strong>Progress is derived.</strong> Project percentages come from real milestone and task records, not a manually typed number.</div>
        </Panel>
      </div>
      <div>
        <div className="callout" style={{marginBottom:20}}><span className="co-ico">✳</span><div><h4>Review needed from you</h4><p>“Finalise A+ module copy deck” is in internal review. Uploading a file does not complete a task — an authorised reviewer must approve it first.</p><Link href="/workspace/reviews" className="btn btn-outline btn-sm" style={{marginTop:12}}>Go to reviews →</Link></div></div>
        <Panel title="Department: Creative Design & Video">
          <div className="metric-row"><span>Head</span><strong>Chidi Okafor</strong></div>
          <div className="metric-row"><span>Members</span><strong>6</strong></div>
          <div className="metric-row"><span>Open tasks</span><strong>14</strong></div>
          <div className="metric-row"><span>Awaiting review</span><strong>3</strong></div>
          <p className="small faint" style={{marginTop:14,marginBottom:0}}>Your job title describes your role — it does not grant system permissions. Permissions are assigned separately.</p>
        </Panel>
        <Panel title="Recent team activity">
          <ul className="timeline">
            <li><div className="t">Aisha uploaded creative pack v3</div><div className="d">24 Oct 2026 · The Salt Road</div></li>
            <li><div className="t">Tola requested changes on homepage proof</div><div className="d">23 Oct 2026 · Author platform refresh</div></li>
            <li className="dim"><div className="t">Keyword set approved</div><div className="d">22 Oct 2026 · Ash & Ink metadata</div></li>
          </ul>
        </Panel>
      </div>
    </div>
  </>;
}
