import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { team } from '@/lib/demo-data';
export default function AdminTeam(){
  return <>
    <AppHead title="Team & departments" subtitle="Organisation structure, memberships, reporting lines and role assignments."/>
    <KpiRow items={[{label:'Staff accounts',value:'14'},{label:'Departments',value:'7'},{label:'Department heads',value:'7'},{label:'System admins',value:'2'}]}/>
    <Panel title="Staff" flush>
      <SimpleTable columns={['Name','Job title','Department','Account','System roles']} rows={team.map(t=>[
        <span><strong>{t.name}</strong><span className="sub">{t.initials}@authorreachstudio.com</span></span>, t.role, t.dept,
        <Badge tone={t.status==='Active'?'ok':'warn'}>{t.status}</Badge>,
        <span className="small faint">Assigned separately →</span>,
      ])}/>
    </Panel>
    <div className="split">
      <Panel title="Departments" flush>
        <SimpleTable columns={['Department','Head','Members']} rows={[
          ['Client Relations & Author Success','Bimpe Adeyemi','3'],
          ['Book Optimization & Publishing Support','Chidi Okafor','2'],
          ['Creative Design & Video Production','Chidi Okafor','6'],
          ['Marketing & Publicity','Tola Adebayo','4'],
          ['Research & Discoverability','Chidi Okafor','3'],
          ['Project Management','Tola Adebayo','2'],
          ['Finance & Administration','Emeka Obi','2'],
        ].map(r=>[<strong>{r[0]}</strong>,r[1],r[2]])}/>
      </Panel>
      <Panel title="Permission principles">
        <p className="small muted">A job title is descriptive only. Access comes from role assignments plus resource-level relationships (department membership, project membership, author membership).</p>
        <div className="metric-row"><span>Team member</span><strong>Assigned tasks only</strong></div>
        <div className="metric-row"><span>Department head</span><strong>Own department</strong></div>
        <div className="metric-row"><span>Project manager</span><strong>Own projects</strong></div>
        <div className="metric-row"><span>Finance officer</span><strong>Finance only</strong></div>
        <div className="metric-row"><span>Administrator</span><strong>Users + config</strong></div>
        <div className="metric-row"><span>Executive</span><strong>Authorised reports</strong></div>
        <div className="notice" style={{marginTop:16,fontSize:'.8rem'}}><strong>No self-escalation.</strong> Users cannot insert or update their own <code>user_roles</code> rows. Only trusted server-side logic can grant roles.</div>
      </Panel>
    </div>
  </>;
}
