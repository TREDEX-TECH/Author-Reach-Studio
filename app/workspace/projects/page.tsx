import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge, Progress, EmptyState } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function WorkspaceProjects(){
  const s = await getSnapshot();
  return <>
    <AppHead title="Projects" subtitle="Projects your role is authorised to access, with progress calculated from completed milestones."/>
    <KpiRow items={[
      {label:'Visible projects',value:String(s.counts.projects)},
      {label:'Active',value:String(s.counts.activeProjects)},
      {label:'Completed',value:String(s.projects.filter(p=>/completed/i.test(p.status)).length)},
      {label:'Milestones',value:String(s.projects.reduce((n,p)=>n+p.milestones.length,0))},
    ]}/>
    {s.projects.length ? s.projects.map(p=><Panel key={p.id} title={p.name} action={<Badge tone={p.tone}>{p.status}</Badge>}>
      <div className="spread" style={{marginBottom:12}}><span className="small faint">{p.ref} · {p.book} · Due {p.due} · Manager {p.manager}</span><strong className="small">{p.progress}%</strong></div>
      <Progress value={p.progress} tone={p.tone==='warn'?'warn':''}/>
      {p.milestones.length ? <div className="row" style={{gap:8,marginTop:16,flexWrap:'wrap'}}>{p.milestones.map(m=><Badge key={m.label} tone={m.done?'ok':'neutral'}>{m.done?'✓ ':'○ '}{m.label}</Badge>)}</div>
        : <p className="small faint" style={{margin:'14px 0 0'}}>No milestones recorded yet, so progress is 0%.</p>}
    </Panel>)
    : <Panel title="Projects"><EmptyState icon="▣" title="No projects yet" body="Projects created from accepted proposals appear here. Progress is never estimated — it is calculated only from completed milestones in live records."/></Panel>}
  </>;
}
