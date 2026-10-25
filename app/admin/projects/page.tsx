import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, Progress } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function AdminProjects(){
  const s = await getSnapshot();
  const rows = s.projects.map(p=>[
    <span><strong>{p.name}</strong><span className="sub">{p.ref} · {p.book}</span></span>,
    p.manager, <Badge tone={p.tone}>{p.status}</Badge>, p.due,
    <div style={{minWidth:110}}><Progress value={p.progress} tone={p.tone==='warn'?'warn':''}/><span className="small faint">{p.progress}% · {p.milestones.filter(m=>m.done).length}/{p.milestones.length} milestones</span></div>,
  ]);
  return <>
    <AppHead title="Projects" subtitle="Create projects from accepted proposals, assign departments and track real progress."/>
    <KpiRow items={[
      {label:'Projects',value:String(s.counts.projects)},
      {label:'Active',value:String(s.counts.activeProjects)},
      {label:'Completed',value:String(s.projects.filter(p=>/completed/i.test(p.status)).length)},
      {label:'Tasks',value:String(s.counts.tasks)},
    ]}/>
    <Panel title="All projects" flush><SimpleTable columns={['Project','Manager','Status','Target','Progress']} rows={rows}
      empty={{title:'No projects yet',body:'Projects appear when an accepted proposal is converted into an engagement. An empty list means no delivery work has been created.'}}/></Panel>
    <div className="notice notice-teal"><span><strong>Workflow integrity.</strong> A project can be blocked, paused or cancelled without losing its history. Progress is calculated from completed milestones; uploading a file alone never marks a reviewable task complete.</span></div>
  </>;
}
