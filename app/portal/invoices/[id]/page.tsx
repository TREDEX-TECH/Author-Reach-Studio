import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArsLogo, TredexLogo } from '@/components/brand';
import { Badge } from '@/components/ui';
import { ProceedToPayment } from '@/components/proceed-to-payment';
import { PrintButton } from '@/components/print-button';
import { getInvoice, getSnapshot } from '@/lib/data/live';
import { SITE } from '@/lib/config';
import { money, titleCase } from '@/lib/format';

type EntitySnapshot = Record<string, unknown>;
const text = (v: unknown) => typeof v === 'string' && v.trim() ? v.trim() : '';

export default async function InvoiceDetail({ params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  const inv = await getInvoice(id);
  if (!inv) notFound();
  const s = await getSnapshot();

  const entity: EntitySnapshot = inv.legalEntity && typeof inv.legalEntity === 'object'
    ? inv.legalEntity as EntitySnapshot : {};
  const fromName = text(entity.legal_name) || text(entity.name) || SITE.name;
  const registration = text(entity.registration_number) || text(entity.registration_no);
  const fromAddress = text(entity.address) || SITE.address;
  const fromEmail = text(entity.email) || SITE.email;

  const items = inv.items.length ? inv.items : [{
    description: inv.description || 'Services as agreed in the accepted proposal',
    quantity: 1, unit: inv.subtotal || inv.amount, total: inv.subtotal || inv.amount,
  }];
  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const tax = inv.tax;
  const paid = Math.min(inv.paid, inv.amount);
  const balance = Math.max(0, inv.amount - paid);
  const settled = balance <= 0 && /paid|refund/i.test(inv.status);
  const canPay = !!process.env.PAYSTACK_SECRET_KEY
    && balance > 0
    && !/draft|cancel|refund/i.test(inv.status);
  const attempts = s.payments.filter(p => p.invoiceId === inv.id);

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
                Book marketing, discoverability and author-brand support.<br/>
                {fromEmail}{fromAddress ? ` · ${fromAddress}` : ''}
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
            <div><div className="lbl">Currency</div><strong>{inv.currency.trim()} ({inv.currency.trim() === 'USD' ? '$' : inv.currency.trim()})</strong></div>
            <div><div className="lbl">Payment terms</div><strong>14 days</strong></div>
            <div><div className="lbl">Invoice reference</div><strong>{inv.number}</strong></div>
            <div><div className="lbl">Payment method</div><strong>Paystack · server-verified</strong></div>
          </section>

          <section className="inv-parties">
            <div>
              <h4>From</h4>
              <p><strong>{fromName}</strong><br/>{SITE.relationship}
                {registration ? <><br/>Registration: {registration}</> : null}
                <br/>{fromEmail}{fromAddress ? <><br/>{fromAddress}</> : null}</p>
            </div>
            <div>
              <h4>Bill to</h4>
              <p><strong>{inv.billTo}</strong><br/>Client account on file<br/>{inv.billToEmail}</p>
            </div>
          </section>

          <section className="inv-items">
            <div className="table-wrap"><table>
              <thead><tr><th style={{width:'52%'}}>Description</th><th>Qty</th><th>Unit price</th><th style={{textAlign:'right'}}>Line total</th></tr></thead>
              <tbody>
                {items.map((i, n) => (
                  <tr key={`${i.description}-${n}`}>
                    <td><strong>{i.description}</strong></td>
                    <td>{i.quantity}</td><td>{money(i.unit, inv.currency)}</td>
                    <td style={{textAlign:'right'}} className="money">{money(i.total, inv.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </section>

          <div className="inv-totals"><div className="inv-totals-box">
            <div className="metric-row"><span>Subtotal</span><strong>{money(subtotal, inv.currency)}</strong></div>
            <div className="metric-row"><span>Tax / VAT</span><strong>{money(tax, inv.currency)}</strong></div>
            <div className="metric-row"><span>Amount paid</span><strong>{money(paid, inv.currency)}</strong></div>
            <div className="metric-row grand"><span><strong>Balance due</strong></span><strong className="money">{money(balance, inv.currency)}</strong></div>
          </div></div>

          <footer className="inv-foot">
            <div className="row" style={{gap:12,flexWrap:'nowrap'}}>
              <TredexLogo size={38} />
              <p><strong style={{color:'var(--ink-2)'}}>{SITE.relationship}</strong><br/>
              Payment is confirmed only after server-side verification with Paystack. A browser success page is never proof of payment. Invoices and verified payment records are retained for accounting purposes.</p>
            </div>
            <span className="small faint">Thank you for working with us.</span>
          </footer>
        </article>

        <aside className="pay-card no-print">
          <div className="pay-card-top">
            <div className="lbl">{settled ? 'Settled' : 'Balance due'}</div>
            <div className="amt">{money(balance, inv.currency)}</div>
            <div className="small" style={{opacity:.9,marginTop:4}}>{settled ? 'No payment required' : `Due ${inv.due}`}</div>
          </div>
          <div className="pay-card-body">
            <ProceedToPayment invoiceId={inv.id} invoiceNumber={inv.number} enabled={canPay}/>
            <div className="divider" style={{margin:'18px 0'}}/>
            <div className="metric-row"><span>Invoice</span><strong>{inv.number}</strong></div>
            <div className="metric-row"><span>Issued</span><strong>{inv.date}</strong></div>
            <div className="metric-row"><span>Due</span><strong>{inv.due}</strong></div>
            <div className="metric-row"><span>Currency</span><strong>{inv.currency.trim()}</strong></div>
            <div className="metric-row"><span>Partial payments</span><strong>By arrangement</strong></div>
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
              {attempts.length ? attempts.map(p => (
                <tr key={p.id}><td><span className="small">{p.reference}</span></td><td>{p.date}</td>
                  <td className="money">{money(p.amount, p.currency)}</td>
                  <td><Badge tone={p.verified ? 'ok' : 'warn'}>{p.verified ? 'Verified · Paystack' : titleCase(p.status)}</Badge></td></tr>
              )) : (
                <tr><td colSpan={4}><span className="small faint">No payment attempts recorded for this invoice. Failed and abandoned attempts will appear here without changing your balance.</span></td></tr>
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
