import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge, Progress } from '@/components/ui';
import { EmptyRecords } from '@/components/empty-records';
import { getSnapshot } from '@/lib/data/live';
export default async function PortalProjects(){
  const s = await getSnapshot();
  return <>
    <AppHead title="Projects" subtitle="Track milestones and approved progress updates for every engagement."/>
    <KpiRow items={[{label:'Projects',value:String(s.counts.projects)},
      {label:'Active',value:String(s.counts.activeProjects)},
      {label:'Completed',value:String(s.projects.filter(p=>/completed/i.test(p.status)).length)},
      {label:'Files available',value:String(s.counts.files)}]}/>
    {s.projects.length ? s.projects.map(p=>(
      <Panel key={p.id} title={p.name} action={<Badge tone={p.tone}>{p.status}</Badge>}>
        <div className="spread" style={{marginBottom:16}}><div className="small faint">{p.ref} · Book: {p.book} · Target: {p.due}</div><span className="small" style={{fontWeight:700}}>{p.progress}%</span></div>
        <Progress value={p.progress} tone={p.tone==='warn'?'warn':''}/>
        <div className="grid grid-2" style={{marginTop:22,gap:26}}>
          <div><h4>Milestones</h4>
            {p.milestones.length ? <ul className="timeline" style={{marginTop:14}}>{p.milestones.map(m=><li key={m.label} className={m.done?'':'dim'}><div className="t">{m.label}</div><div className="d">{m.done?'Completed':'Upcoming'}</div></li>)}</ul>
              : <p className="small faint">No milestones recorded yet.</p>}
          </div>
          <div><h4>Approved progress update</h4>
            <p className="small muted">Progress is calculated from completed milestones and approved tasks — not a manually typed percentage. Client-visible updates are published after internal review.</p>
            <div className="row" style={{marginTop:16}}><Link href="/portal/files" className="btn btn-outline btn-sm">View deliverables</Link><Link href="/portal/messages" className="btn btn-ghost btn-sm">Message the team →</Link></div>
          </div>
        </div>
      </Panel>))
      : <Panel title="Projects"><EmptyRecords noun="projects" body="When a proposal is accepted, its project, milestones and deliverables appear here automatically. There are no invented timelines on this page." href="/contact" action="Enquire about a project →" /></Panel>}
  </>;
}
