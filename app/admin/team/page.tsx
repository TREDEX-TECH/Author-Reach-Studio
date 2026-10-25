import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function AdminTeam(){
  const s = await getSnapshot();
  const rows = s.team.map(t=>[
    <span><strong>{t.name}</strong><span className="sub">{t.email}</span></span>,
    t.role, t.dept, <Badge tone={t.status==='Active'?'ok':'warn'}>{t.status}</Badge>,
  ]);
  return <>
    <AppHead title="Team & departments" subtitle="Roles are assigned explicitly; job titles never grant permissions on their own."/>
    <KpiRow items={[
      {label:'Profiles',value:String(s.counts.team)},
      {label:'Departments',value:String(s.counts.departments)},
      {label:'Roles',value:String(s.counts.roles)},
      {label:'Permissions',value:String(s.counts.permissions)},
    ]}/>
    <Panel title="People" flush><SimpleTable columns={['Name','Assigned role','Department','Account status']} rows={rows}
      empty={{title:'No staff accounts yet',body:'Accounts are created by an administrator and appear here with their assigned roles and departments. No example employees are shown.'}}/></Panel>
    <div className="split" style={{marginTop:20}}>
      <Panel title="Departments">
        {s.departments.length ? s.departments.map(d=><div className="metric-row" key={d.id}><span><strong style={{fontSize:'.86rem'}}>{d.name}</strong><span className="sub">Head: {d.head}</span></span><Badge tone={d.active?'ok':'neutral'}>{d.members} members</Badge></div>)
          : <p className="small faint" style={{margin:0}}>No departments visible to this session.</p>}
      </Panel>
      <Panel title="Configured roles">
        {s.roles.length ? s.roles.map(r=><div className="metric-row" key={r.id}><span><code style={{fontSize:'.78rem'}}>{r.slug}</code><span className="sub">{r.name}</span></span></div>)
          : <p className="small faint" style={{margin:0}}>No roles visible to this session.</p>}
        <div className="notice" style={{marginTop:16,fontSize:'.8rem'}}><strong>Multiple roles are supported.</strong> A person can hold more than one role, and roles can expire. Job titles are descriptive only.</div>
      </Panel>
    </div>
  </>;
}
