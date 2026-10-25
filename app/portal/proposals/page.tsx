import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { proposals, money } from '@/lib/demo-data';
export default function PortalProposals(){
  const rows = proposals.map(p=>[
    <span><strong>{p.id}</strong><span className="sub">{p.title}</span></span>,
    p.version, p.date, p.valid, <span className="money">{money(p.amount)}</span>,
    <Badge tone={p.tone}>{p.status}</Badge>,
    <Link href="/portal/proposals" className="btn btn-outline btn-sm">View version</Link>,
  ]);
  return <>
    <AppHead title="Proposals" subtitle="Every proposal version is preserved. Accepting an online proposal records the exact terms you agreed to."/>
    <KpiRow items={[{label:'Awaiting decision',value:'1',delta:'Expires 19 Nov 2026',negative:true},{label:'Accepted',value:'1'},{label:'Declined',value:'1'},{label:'Total proposed',value:money(5650)}]}/>
    <Panel title="All proposals" flush><SimpleTable columns={['Reference','Version','Sent','Valid until','Value','Status','']} rows={rows}/></Panel>
    <div className="split">
      <Panel title="Awaiting your decision — PROP-2026-0091">
        <p className="small muted">Author website phase 2 · Version v1 · {money(1800)} · Valid until 19 Nov 2026.</p>
        <div className="row" style={{marginTop:16}}>
          <Link href="/portal/proposals" className="btn btn-primary btn-sm">Accept proposal</Link>
          <Link href="/portal/proposals" className="btn btn-outline btn-sm">Decline</Link>
          <Link href="/portal/proposals" className="btn btn-ghost btn-sm">Download PDF</Link>
        </div>
        <div className="notice" style={{marginTop:18,fontSize:'.8rem'}}><strong>Version integrity.</strong> The scope, deliverables, price, currency and terms of the accepted version are stored as an immutable snapshot. Later changes to the service catalogue never alter what you agreed to.</div>
      </Panel>
      <Panel title="What acceptance records">
        {['Proposal ID and version number','A hash of the accepted scope and terms','Your user ID and timestamp','IP address and user agent','E-signature provider (if enabled later)'].map(x=>(
          <div className="metric-row" key={x}><span>✓ {x}</span></div>
        ))}
      </Panel>
    </div>
  </>;
}
