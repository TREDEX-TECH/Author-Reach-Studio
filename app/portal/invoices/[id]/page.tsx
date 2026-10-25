import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArsLogo, TredexLogo } from '@/components/brand';
import { Badge } from '@/components/ui';
import { ProceedToPayment } from '@/components/proceed-to-payment';
import { PrintButton } from '@/components/print-button';
import { invoices, money, BRAND } from '@/lib/demo-data';

const LINE_ITEM_TEMPLATE = [
  { name:'Strategy, research & planning', share:0.45 },
  { name:'Creative production & implementation', share:0.35 },
  { name:'Reporting, handover & support', share:0.20 },
];
function lineItemsFor(total: number) {
  const rows = LINE_ITEM_TEMPLATE.map(i => ({ name:i.name, qty:1, unit:Math.round(total*i.share) }));
  rows[rows.length-1].unit = total - rows.slice(0,-1).reduce((s,r)=>s+r.unit,0);
  return rows;
}

export default async function InvoiceDetail({ params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  const inv = invoices.find(i => i.id === id);
  if (!inv) notFound();
  const paid = inv.status === 'Paid' || inv.status === 'Refunded';
  const balance = paid ? 0 : inv.amount;
  const LINE_ITEMS = lineItemsFor(inv.amount);
  const subtotal = LINE_ITEMS.reduce((s,i)=>s+i.qty*i.unit,0);

  return (
    <>
      <div className="breadcrumbs no-print" style={{marginBottom:14}}>
        <Link href="/portal">Portal</Link><span>/</span><Link href="/portal/invoices">Invoices</Link><span>/</span><span>{inv.number}</span>
      </div>

      <div className="app-head no-print">
        <div><h2>Invoice {inv.number}</h2><p>{inv.description} · Issued {inv.date}</p></div>
        <div className="row">
          <Badge tone={inv.tone}>{inv.status}</Badge>
          <PrintButton />
          <Link href="/portal/invoices" className="btn btn-outline btn-sm">← All invoices</Link>
        </div>
      </div>

      <div className="invoice-shell">
        <article className="invoice-paper" id="invoice-print">
          <header className="inv-head">
            <div>
              <ArsLogo height={64} />
              <p className="small" style={{margin:'12px 0 0',color:'var(--muted)',maxWidth:'34ch'}}>
                Author marketing, discoverability &amp; growth.<br/>{BRAND.email} · {BRAND.address}
              </p>
            </div>
            <div className="inv-title">
              <b>INVOICE</b>
              <span>#{inv.number}</span>
              <div style={{marginTop:10}}><Badge tone={inv.tone}>{inv.status}</Badge></div>
            </div>
          </header>

          <section className="inv-meta">
            <div><div className="lbl">Issue date</div><strong>{inv.date}</strong></div>
            <div><div className="lbl">Due date</div><strong>{inv.due}</strong></div>
            <div><div className="lbl">Currency</div><strong>USD ($)</strong></div>
            <div><div className="lbl">Payment terms</div><strong>14 days</strong></div>
            <div><div className="lbl">Invoice reference</div><strong>{inv.number}</strong></div>
            <div><div className="lbl">Payment method</div><strong>Paystack · verified</strong></div>
          </section>

          <section className="inv-parties">
            <div>
              <h4>From</h4>
              <p><strong>Author Reach Studio</strong><br/>A specialist brand of Tredex<br/>
              Registered service provider: <em>to be confirmed</em><br/>{BRAND.email}</p>
            </div>
            <div>
              <h4>Bill to</h4>
              <p><strong>Amara Nwosu</strong><br/>Author / client account<br/>amara@example.com<br/>Ibadan, Nigeria</p>
            </div>
          </section>

          <section className="inv-items">
            <div className="table-wrap"><table>
              <thead><tr><th style={{width:'52%'}}>Description</th><th>Qty</th><th>Unit price</th><th style={{textAlign:'right'}}>Line total</th></tr></thead>
              <tbody>
                {LINE_ITEMS.map(i => (
                  <tr key={i.name}>
                    <td><strong>{i.name}</strong><span className="sub">{inv.description}</span></td>
                    <td>{i.qty}</td><td>{money(i.unit)}</td>
                    <td style={{textAlign:'right'}} className="money">{money(i.qty*i.unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </section>

          <div className="inv-totals"><div className="inv-totals-box">
            <div className="metric-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div className="metric-row"><span>Tax / VAT</span><strong>{money(0)}</strong></div>
            <div className="metric-row"><span>Amount paid</span><strong>{money(paid ? inv.amount : 0)}</strong></div>
            <div className="metric-row grand"><span><strong>Balance due</strong></span><strong className="money">{money(balance)}</strong></div>
          </div></div>

          <footer className="inv-foot">
            <div className="row" style={{gap:12,flexWrap:'nowrap'}}>
              <TredexLogo size={38} />
              <p><strong style={{color:'var(--ink-2)'}}>{BRAND.relationship}</strong><br/>
              Payment is only confirmed after server-side verification with Paystack. A browser success page is never proof of payment. Invoices and verified payment records are retained for accounting purposes.</p>
            </div>
            <span className="small faint">Thank you for working with us.</span>
          </footer>
        </article>

        <aside className="pay-card no-print">
          <div className="pay-card-top">
            <div className="lbl">{paid ? 'Settled' : 'Amount due'}</div>
            <div className="amt">{money(balance)}</div>
            <div className="small" style={{opacity:.9,marginTop:4}}>{inv.status === 'Outstanding' ? `Due ${inv.due}` : 'No payment required'}</div>
          </div>
          <div className="pay-card-body">
            {inv.status === 'Outstanding' ? (
              <>
                <ProceedToPayment invoiceId={inv.id} invoiceNumber={inv.number}/>
                <div className="divider" style={{margin:'18px 0'}}/>
                <div className="metric-row"><span>Invoice</span><strong>{inv.number}</strong></div>
                <div className="metric-row"><span>Issued</span><strong>{inv.date}</strong></div>
                <div className="metric-row"><span>Due</span><strong>{inv.due}</strong></div>
                <div className="metric-row"><span>Currency</span><strong>USD ($)</strong></div>
                <div className="metric-row"><span>Partial payments</span><strong>Disabled</strong></div>
              </>
            ) : (
              <div className="notice notice-teal" style={{fontSize:'.83rem'}}>
                <span>This invoice is <strong>{inv.status.toLowerCase()}</strong>. Its state was derived from a verified payment record — not from a browser redirect. No further payment is required.</span>
              </div>
            )}
            <div className="divider" style={{margin:'18px 0'}}/>
            <h4 style={{fontFamily:'var(--sans)',fontSize:'.82rem',marginBottom:10}}>Security checks</h4>
            {[
              'Invoice belongs to your author account',
              'Invoice is not cancelled or already paid',
              'Amount is re-read from the database',
              'Currency matches the Paystack merchant',
              'Charge cannot exceed the balance',
              'Provider reference is unique',
              'Webhook signature validated',
              'Re-verified with Paystack before status change',
            ].map(x => <div key={x} className="metric-row" style={{fontSize:'.78rem',padding:'8px 0'}}><span>✓ {x}</span></div>)}
            <div className="notice" style={{marginTop:16,fontSize:'.76rem'}}>
              <strong>Never pay from a chat link.</strong> Invoices are paid only from inside your client portal.
            </div>
          </div>
        </aside>
      </div>

      <div className="split no-print" style={{marginTop:20}}>
        <div className="panel" style={{marginBottom:0}}>
          <div className="panel-head"><h3>Payment attempts &amp; verification history</h3></div>
          <div className="panel-body flush"><div className="table-wrap" style={{border:'none'}}><table>
            <thead><tr><th>Reference</th><th>Date</th><th>Amount</th><th>Result</th></tr></thead>
            <tbody>
              {paid ? (
                <tr><td><span className="small">{`ARS-${inv.number}-8f3a21c4`}</span></td><td>{inv.date}</td><td className="money">{money(inv.amount)}</td><td><Badge tone="ok">Verified · Paystack</Badge></td></tr>
              ) : (
                <tr><td colSpan={4}><span className="small faint">No payment attempts recorded yet for this invoice. Failed and abandoned attempts will appear here without changing your balance.</span></td></tr>
              )}
            </tbody>
          </table></div></div>
        </div>
        <div className="panel" style={{marginBottom:0}}>
          <div className="panel-head"><h3>Need help with this invoice?</h3></div>
          <div className="panel-body">
            <p className="small muted">Questions about scope, a payment plan, or a receipt? Message your project team — the conversation stays attached to your project.</p>
            <Link href="/portal/messages" className="btn btn-outline btn-sm">Message the team →</Link>
          </div>
        </div>
      </div>
    </>
  );
}
