import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { HeroBanner } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
import { money } from '@/lib/format';
export default async function PortalInvoices(){
  const s = await getSnapshot();
  const paid = s.invoices.filter(i=>/paid/i.test(i.status));
  const rows = s.invoices.map(i=>[
    <span><strong>{i.number}</strong><span className="sub">{i.description}</span></span>,
    i.date, i.due, <span className="money">{money(i.amount,i.currency)}</span>,
    <Badge tone={i.tone}>{i.status}</Badge>,
    <Link href={`/portal/invoices/${i.id}`} className="btn btn-outline btn-sm">View invoice</Link>,
  ]);
  return <>
    <HeroBanner title="Invoices & payments" text="View invoices, payment history and receipts. Every payment is verified on our servers before any status changes." />
    <KpiRow items={[
      {label:'Outstanding',value:money(s.counts.outstanding)},
      {label:'Paid',value:money(paid.reduce((a,i)=>a+i.amount,0))},
      {label:'Invoices',value:String(s.counts.invoices)},
      {label:'Verified payments',value:String(s.payments.filter(p=>p.verified).length)},
    ]}/>
    <div className="notice notice-teal" style={{marginBottom:20}}><span><strong>How payment works.</strong> Select “Proceed to Payment” on an eligible invoice. A trusted server function re-checks the invoice, amount, currency and your access, then initialises a Paystack transaction. Only a server-verified transaction can mark an invoice paid — a browser success page never can.</span></div>
    <Panel title="All invoices" flush><SimpleTable columns={['Invoice','Issued','Due','Amount','Status','Action']} rows={rows}
      empty={{title:'No invoices yet',body:'Invoices appear here when issued against an accepted proposal. An empty list means nothing is owed — we do not display sample invoices.'}}/></Panel>
    <div className="split">
      <Panel title="Payment history">
        {s.payments.filter(p=>p.verified).length ? s.payments.filter(p=>p.verified).map(p=>(
          <div className="metric-row" key={p.id}><span><strong style={{fontSize:'.84rem'}}>{p.reference}</strong><span className="sub">{p.date} · Paystack verified</span></span><strong className="money">{money(p.amount,p.currency)}</strong></div>))
          : <p className="small faint" style={{margin:0}}>No verified payments yet. Failed and abandoned attempts are recorded separately and never change your balance.</p>}
      </Panel>
      <Panel title="Billing details">
        <div className="metric-row"><span>Currency</span><strong>USD ($)</strong></div>
        <div className="metric-row"><span>Payment terms</span><strong>14 days</strong></div>
        <div className="metric-row"><span>Partial payments</span><strong>By arrangement</strong></div>
        <div className="metric-row"><span>Payment recipient</span><strong>As stated on your invoice</strong></div>
      </Panel>
    </div>
  </>;
}
