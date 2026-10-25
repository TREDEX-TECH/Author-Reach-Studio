import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge, Progress, EmptyState } from '@/components/ui';
import { projects } from '@/lib/demo-data';
export default function PortalProjects(){
  return <>
    <AppHead title="Projects" subtitle="Track milestones and approved progress updates for every engagement."/>
    <KpiRow items={[{label:'Active',value:'2'},{label:'Awaiting your review',value:'1',delta:'Action needed',negative:true},{label:'Completed',value:'1'},{label:'Files available',value:'18'}]}/>
    {projects.map(p=>(
      <Panel key={p.id} title={p.name} action={<Badge tone={p.tone}>{p.status}</Badge>}>
        <div className="spread" style={{marginBottom:16}}>
          <div className="small faint">{p.id} · Book: {p.book} · Project manager: {p.manager} · Target: {p.due}</div>
          <span className="small" style={{fontWeight:700}}>{p.progress}%</span>
        </div>
        <Progress value={p.progress} tone={p.tone==='warn'?'warn':''}/>
        <div className="grid grid-2" style={{marginTop:22,gap:26}}>
          <div>
            <h4>Milestones</h4>
            <ul className="timeline" style={{marginTop:14}}>
              {p.milestones.map(m=><li key={m.label} className={m.done?'':'dim'}><div className="t">{m.label}</div><div className="d">{m.done?'Completed':'Upcoming'}</div></li>)}
            </ul>
          </div>
          <div>
            <h4>Approved progress update</h4>
            <p className="small muted">{p.status==='Completed'?'All milestones delivered. Final report and source files are available in Files & deliverables.':'Work is progressing against the agreed scope. Client-visible updates are published here after internal review — raw drafts and internal notes stay private.'}</p>
            <div className="row" style={{marginTop:16}}>
              <Link href="/portal/files" className="btn btn-outline btn-sm">View deliverables</Link>
              <Link href="/portal/messages" className="btn btn-ghost btn-sm">Message the team →</Link>
            </div>
            {p.status!=='Completed' && <div className="notice" style={{marginTop:18,fontSize:'.8rem'}}>Progress is calculated from completed milestones and approved tasks — not a manually typed percentage.</div>}
          </div>
        </div>
      </Panel>
    ))}
    <div className="notice notice-teal"><span><strong>No active project?</strong> If you do not currently have an engagement, this page shows an honest empty state instead of a fabricated timeline. Enquiries and proposals remain available in your portal.</span></div>
  </>;
}
