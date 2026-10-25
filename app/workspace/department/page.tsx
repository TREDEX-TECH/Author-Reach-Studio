import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { team } from '@/lib/demo-data';
export default function WorkspaceDepartment(){
  return <>
    <AppHead title="My department" subtitle="Creative Design & Video · your team, reporting line and workload."/>
    <KpiRow items={[{label:'Department members',value:'6'},{label:'Open tasks',value:'14'},{label:'Awaiting review',value:'3'},{label:'Department head',value:'Chidi'}]}/>
    <div className="split">
      <Panel title="Team members" flush>
        <SimpleTable columns={['Name','Job title','Department','Status']} rows={team.map(t=>[
          <span><strong>{t.name}</strong></span>, t.role, t.dept, <Badge tone={t.status==='Active'?'ok':'warn'}>{t.status}</Badge>,
        ])}/>
      </Panel>
      <Panel title="Organisation rules">
        <div className="metric-row"><span>Parent business</span><strong>Tredex</strong></div>
        <div className="metric-row"><span>Brand</span><strong>Author Reach Studio</strong></div>
        <div className="metric-row"><span>Your department</span><strong>Creative Design & Video</strong></div>
        <div className="metric-row"><span>Reports to</span><strong>Chidi Okafor</strong></div>
        <div className="notice" style={{marginTop:18,fontSize:'.82rem'}}><strong>Titles are descriptive.</strong> A job title such as “Marketing Manager” never grants system-wide access. Permissions come from explicit role assignments, and a department head does not automatically see every client conversation.</div>
      </Panel>
    </div>
  </>;
}
