import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, Progress } from '@/components/ui';
import { projects } from '@/lib/demo-data';
export default function WorkspaceProjects(){
  return <>
    <AppHead title="Projects" subtitle="Projects you are authorised to access, with real milestone progress."/>
    <KpiRow items={[{label:'My projects',value:'3'},{label:'Active',value:'2'},{label:'Awaiting review',value:'1'},{label:'Overdue tasks',value:'1',delta:'Needs attention',negative:true}]}/>
    {projects.map(p=><Panel key={p.id} title={p.name} action={<Badge tone={p.tone}>{p.status}</Badge>}>
      <div className="spread" style={{marginBottom:12}}><span className="small faint">{p.id} · {p.book} · Due {p.due} · PM {p.manager}</span><strong className="small">{p.progress}%</strong></div>
      <Progress value={p.progress} tone={p.tone==='warn'?'warn':''}/>
    </Panel>)}
  </>;
}
