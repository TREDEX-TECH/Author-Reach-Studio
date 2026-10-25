import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, HeroBanner } from '@/components/ui';
import { invoices, money } from '@/lib/demo-data';
export default function PortalInvoices(){
  const rows = invoices.map(i=>[
    <span><strong>{i.number}</strong><span className="sub">{i.description}</span></span>,
    i.date, i.due, <span className="money">{money(i.amount)}</span>,
    <Badge tone={i.tone}>{i.status}</Badge>,
    i.status==='Outstanding'
      ? <Link href={`/portal/invoices/${i.id}`} className="btn btn-primary btn-sm">Proceed to Payment</Link>
      : <Link href={`/portal/invoices/${i.id}`} className="btn btn-outline btn-sm">View invoice</Link>,
  ]);
  return <>
    <HeroBanner title="Invoices & payments" text="View invoices, payment history and receipts. Every payment is verified on our servers before any status changes." />
    <KpiRow items={[
      {label:'Outstanding',value:money(1450),delta:'Due 26 Oct 2026',negative:true,icon:'◈'},
      {label:'Paid this year',value:money(1550),delta:'2 verified payments',icon:'✓',iconTone:'green'},
      {label:'Refunded',value:money(1200),icon:'↺',iconTone:'violet'},
      {label:'Open invoices',value:'1',icon:'▦',iconTone:'blue'},
    ]}/>
    <div className="notice notice-teal" style={{marginBottom:20}}><span><strong>How payment works.</strong> Select “Proceed to Payment” on an eligible invoice. A trusted server function re-checks the invoice, amount, currency and your access, then initialises a Paystack transaction. Only a server-verified transaction can mark an invoice paid — a browser success page never can.</span></div>
    <Panel title="All invoices" flush><SimpleTable columns={['Invoice','Issued','Due','Amount','Status','Action']} rows={rows}/></Panel>
    <div className="split">
      <Panel title="Payment history">
        {[['02 Sep 2026','ARS-2026-0038',850,'Paystack · verified'],['14 Aug 2026','ARS-2026-0031',700,'Paystack · verified']].map(([d,n,a,src])=>(
          <div className="metric-row" key={n}><span><strong style={{fontSize:'.84rem'}}>{n}</strong><span className="sub">{d} · {src}</span></span><strong className="money">{money(Number(a))}</strong></div>
        ))}
        <div className="divider"/>
        <p className="small faint" style={{margin:0}}>Failed and abandoned attempts are recorded separately and never change your balance. Duplicate webhooks cannot create duplicate payments.</p>
      </Panel>
      <Panel title="Billing details">
        <div className="metric-row"><span>Billing name</span><strong>Amara Nwosu</strong></div>
        <div className="metric-row"><span>Currency</span><strong>USD ($)</strong></div>
        <div className="metric-row"><span>Payment terms</span><strong>14 days</strong></div>
        <div className="metric-row"><span>Payment recipient</span><strong>Registered entity — to confirm</strong></div>
        <div className="notice" style={{marginTop:16,fontSize:'.79rem'}}><strong>Confirm before launch:</strong> the exact legal entity that appears as payment recipient on Paystack and on the invoice.</div>
      </Panel>
    </div>
  </>;
}
