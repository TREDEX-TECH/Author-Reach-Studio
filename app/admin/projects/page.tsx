import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, Progress } from '@/components/ui';
import { projects } from '@/lib/demo-data';
export default function AdminProjects(){
  return <>
    <AppHead title="Projects" subtitle="Create projects from accepted proposals, assign departments and track real progress."/>
    <KpiRow items={[{label:'Active',value:'11'},{label:'Blocked / paused',value:'2',delta:'Needs attention',negative:true},{label:'Completed this quarter',value:'9'},{label:'Tasks awaiting review',value:'6'}]}/>
    <Panel title="All projects" flush>
      <SimpleTable columns={['Project','Client / book','Manager','Status','Target','Progress']} rows={projects.map(p=>[
        <span><strong>{p.name}</strong><span className="sub">{p.id}</span></span>, p.book, p.manager,
        <Badge tone={p.tone}>{p.status}</Badge>, p.due,
        <div style={{minWidth:110}}><Progress value={p.progress} tone={p.tone==='warn'?'warn':''}/><span className="small faint">{p.progress}%</span></div>,
      ])}/>
    </Panel>
    <div className="notice notice-teal"><span><strong>Workflow integrity.</strong> A project can be blocked, paused or cancelled without losing its history. Task progress drives the reported percentage; uploading a file alone never marks a reviewable task complete.</span></div>
  </>;
}
