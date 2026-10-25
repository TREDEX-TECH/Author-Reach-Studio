import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
import { SITE } from '@/lib/config';
export default async function WorkspaceDepartment(){
  const s = await getSnapshot();
  const rows = s.team.map(t=>[
    <span><strong>{t.name}</strong><span className="sub">{t.email}</span></span>,
    t.role, t.dept, <Badge tone={t.status==='Active'?'ok':'warn'}>{t.status}</Badge>,
  ]);
  return <>
    <AppHead title="Departments & team" subtitle="Configurable departments, roles and reporting lines — not hardcoded job-title access."/>
    <KpiRow items={[
      {label:'Departments',value:String(s.counts.departments)},
      {label:'Profiles visible',value:String(s.counts.team)},
      {label:'Roles',value:String(s.counts.roles)},
      {label:'Visible tasks',value:String(s.counts.tasks)},
    ]}/>
    <div className="split">
      <Panel title="Team members" flush><SimpleTable columns={['Name','Role','Department','Account status']} rows={rows}
        empty={{title:'No team members yet',body:'Staff accounts created by an administrator appear here with their assigned roles and departments. No example employees are shown.'}}/></Panel>
      <div>
        <Panel title="Departments">
          {s.departments.length ? s.departments.map(d=><div className="metric-row" key={d.id}><span><strong style={{fontSize:'.86rem'}}>{d.name}</strong><span className="sub">Head: {d.head}</span></span><Badge tone={d.active?'ok':'neutral'}>{d.members} members</Badge></div>)
            : <p className="small faint" style={{margin:0}}>No departments configured yet.</p>}
        </Panel>
        <Panel title="Organisation rules">
          <div className="metric-row"><span>Parent business</span><strong>{SITE.parent}</strong></div>
          <div className="metric-row"><span>Brand</span><strong>{SITE.name}</strong></div>
          <div className="metric-row"><span>Access source</span><strong>Explicit roles</strong></div>
          <div className="notice" style={{marginTop:18,fontSize:'.82rem'}}><strong>Titles are descriptive.</strong> A job title such as “Marketing Manager” never grants system-wide access. Permissions come from explicit role assignments, and a department head does not automatically see every client conversation.</div>
        </Panel>
      </div>
    </div>
  </>;
}
