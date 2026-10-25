import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function AdminAudit(){
  const s = await getSnapshot();
  const rows = s.audit.map(a=>[
    <span className="small faint">{a.when}</span>,
    <Badge tone={a.tone}>{a.action}</Badge>, a.entity, a.actor, a.detail,
  ]);
  return <>
    <AppHead title="Audit log" subtitle="Append-only record of sensitive actions. Not editable by any ordinary user."/>
    <KpiRow items={[
      {label:'Events visible',value:String(s.counts.audit)},
      {label:'Payment verifications',value:String(s.payments.filter(p=>p.verified).length)},
      {label:'Roles',value:String(s.counts.roles)},
      {label:'Config keys',value:String(s.counts.settings)},
    ]}/>
    <Panel title="Recent events" flush><SimpleTable columns={['Date','Action','Entity','Actor','Detail']} rows={rows}
      empty={{title:'No audit events yet',body:'Sensitive changes — role grants, invoice adjustments, approvals, payment verification and configuration updates — are recorded here as they happen.'}}/></Panel>
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
