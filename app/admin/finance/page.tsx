import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { invoices, money } from '@/lib/demo-data';
export default function AdminFinance(){
  return <>
    <AppHead title="Finance" subtitle="Invoices, verified payments, refunds and reconciliation — based on server-verified records."
      action={<Link href="/admin/finance" className="btn btn-primary btn-sm">+ Create invoice</Link>}/>
    <KpiRow items={[
      {label:'Issued (MTD)',value:money(1450)},
      {label:'Outstanding',value:money(2300),delta:'2 overdue',negative:true},
      {label:'Verified payments',value:money(3850),delta:'3 transactions'},
      {label:'Refunds',value:money(1200)},
    ]}/>
    <Panel title="Invoices" flush>
      <SimpleTable columns={['Invoice','Client / description','Issued','Due','Amount','Status','']} rows={invoices.map(i=>[
        <strong>{i.number}</strong>, <span>{i.description}<span className="sub">Amara Nwosu</span></span>, i.date, i.due,
        <span className="money">{money(i.amount)}</span>, <Badge tone={i.tone}>{i.status}</Badge>,
        <a href="#" className="btn btn-outline btn-sm">Open</a>,
      ])}/>
    </Panel>
    <div className="split">
      <Panel title="Payment verification log" flush>
        <SimpleTable columns={['Reference','Invoice','Amount','Verified','Result']} rows={[
          [<span className="small">ARS-ARS-2026-0038-8f3a21c4</span>,'ARS-2026-0038',money(850),'03 Sep 2026',<Badge tone="ok">Verified</Badge>],
          [<span className="small">ARS-ARS-2026-0031-b71c0d92</span>,'ARS-2026-0031',money(700),'15 Aug 2026',<Badge tone="ok">Verified</Badge>],
          [<span className="small">ARS-ARS-2026-0028-deadbeef</span>,'ARS-2026-0028','—','—',<Badge tone="neutral">Abandoned</Badge>],
          [<span className="small">ARS-ARS-2026-0028-c0ffee11</span>,'ARS-2026-0028','—','—',<Badge tone="warn">Failed</Badge>],
        ]}/>
      </Panel>
      <div>
        <Panel title="Finance controls">
          {['Amount is re-read from the DB, never trusted from browser','Cancelled / paid invoices cannot be charged','Charge cannot exceed outstanding balance','Provider reference is unique per transaction','Webhook signature validated on raw body','Paystack re-verification before status change','Idempotent replay of duplicate events','Refunds recorded separately, never deleting payments','Invoice status derived from verified transactions'].map(x=>(
            <div className="metric-row" key={x}><span style={{fontSize:'.81rem'}}>✓ {x}</span></div>
          ))}
        </Panel>
        <Panel title="Role separation"><p className="small muted">A finance officer can create and reconcile invoices. Only a verified server-side webhook can mark a payment successful — no human role can. Role and permission changes are audit-logged.</p></Panel>
      </div>
    </div>
  </>;
}
