import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
export default function AdminAudit(){
  const rows = [
    ['25 Oct 2026, 09:12','payment_verification','payment_transactions','System (webhook)','Verified ARS-ARS-2026-0038-8f3a21c4','ok'],
    ['24 Oct 2026, 16:40','approval','deliverables','Tola Adebayo','Approved metadata audit report','ok'],
    ['24 Oct 2026, 11:03','invoice_adjustment','invoices','Emeka Obi','Issued ARS-2026-0041','info'],
    ['23 Oct 2026, 14:22','proposal_acceptance','proposals','Amara Nwosu','Accepted PROP-2026-0088 v2','teal'],
    ['22 Oct 2026, 10:15','role_change','user_roles','Tola Adebayo','Granted project_manager to C. Okafor','warn'],
    ['21 Oct 2026, 08:51','config_change','application_settings','Tola Adebayo','Set payments.currencies = [USD]','warn'],
  ].map(r=>[<span className="small faint">{r[0]}</span>,<Badge tone={r[5]}>{r[1]}</Badge>,r[2],r[3],r[4]]);
  return <>
    <AppHead title="Audit log" subtitle="Append-only record of sensitive actions. Not editable by any ordinary user."/>
    <KpiRow items={[{label:'Events (30d)',value:'248'},{label:'Payment verifications',value:'3'},{label:'Role changes',value:'2',delta:'Review required',negative:true},{label:'Config changes',value:'4'}]}/>
    <Panel title="Recent events" flush>
      <SimpleTable columns={['Timestamp','Action','Entity','Actor','Detail']} rows={rows}/>
    </Panel>
    <div className="split">
      <Panel title="What is audited">
        {['Role and permission changes','Invoice creation and adjustment','Payment verification','Proposal acceptance','Project / deliverable approval','Privileged record access','Administrative configuration changes'].map(x=>(
          <div className="metric-row" key={x}><span style={{fontSize:'.83rem'}}>✓ {x}</span></div>
        ))}
      </Panel>
      <Panel title="Integrity guarantees"><p className="small muted"><code>audit_events</code> has no UPDATE or DELETE policy for any ordinary role, plus a database trigger that raises an exception on mutation attempts. Only trusted server-side code can insert. This protects historical approvals and financial events from silent overwrites.</p></Panel>
    </div>
  </>;
}
