import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
import { money } from '@/lib/format';
export default async function AdminFinance(){
  const s = await getSnapshot();
  const issued = s.invoices.reduce((n,i)=>n+i.amount,0);
  const verified = s.payments.filter(p=>p.verified);
  const rows = s.invoices.map(i=>[
    <Link href={`/portal/invoices/${i.id}`} className="small" style={{fontWeight:700}}>{i.number}</Link>,
    <span>{i.description}<span className="sub">{i.billTo}</span></span>, i.date, i.due,
    <span className="money">{money(i.amount,i.currency)}</span>, <Badge tone={i.tone}>{i.status}</Badge>,
  ]);
  const attempts = s.payments.map(p=>[
    <span className="small">{p.reference}</span>,
    s.invoices.find(i=>i.id===p.invoiceId)?.number ?? '—',
    <span className="money">{money(p.amount,p.currency)}</span>, p.date,
    <Badge tone={p.verified?'ok':'warn'}>{p.verified?'Verified':p.status}</Badge>,
  ]);
  return <>
    <AppHead title="Finance" subtitle="Invoices, verified payments, refunds and reconciliation — based on server-verified records."/>
    <KpiRow items={[
      {label:'Invoices issued',value:money(issued)},
      {label:'Outstanding',value:money(s.counts.outstanding)},
      {label:'Verified payments',value:money(s.counts.verifiedRevenue)},
      {label:'Payment attempts',value:String(s.counts.payments)},
    ]}/>
    <Panel title="Invoices" flush><SimpleTable columns={['Invoice','Client / description','Issued','Due','Amount','Status']} rows={rows}
      empty={{title:'No invoices yet',body:'Invoices are issued against accepted proposals. No sample invoices or invented payment records appear here.'}}/></Panel>
    <div className="split" style={{marginTop:20}}>
      <Panel title="Payment verification log" flush><SimpleTable columns={['Reference','Invoice','Amount','Date','Result']} rows={attempts}
        empty={{title:'No payment attempts yet',body:'Each initialised transaction is stored separately from the invoice. Only a server-verified successful transaction changes the amount paid.'}}/></Panel>
      <div>
        <Panel title="Finance controls">
          {['Amount is re-read from the DB, never trusted from browser','Cancelled / paid invoices cannot be charged','Charge cannot exceed outstanding balance','Provider reference is unique per transaction','Webhook signature validated on raw body','Paystack re-verification before status change','Idempotent replay of duplicate events','Refunds recorded separately, never deleting payments','Invoice status derived from verified transactions'].map(x=>(
            <div className="metric-row" key={x}><span style={{fontSize:'.81rem'}}>✓ {x}</span></div>
          ))}
        </Panel>
      </div>
    </div>
  </>;
}
