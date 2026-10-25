import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui';
export const metadata: Metadata = { title:'FAQ', description:'Answers to common questions about Author Reach Studio services, pricing, payments and results.' };

const faqs = [
  ['Do you guarantee book sales or rankings?','No. No agency can honestly guarantee sales, rankings or platform visibility, because those depend on retailers, algorithms, reviewers and audiences. We guarantee defined work, clear communication, transparent reporting and honest advice.'],
  ['How does pricing work?','Some services have a published starting price; others are quoted by proposal because the scope depends on your book, platforms and goals. You will always receive a written proposal with deliverables, timeline, price, currency and terms before being asked to pay.'],
  ['How do I pay?','An authorised staff member issues an invoice from the platform. You sign in to your client portal, open the invoice and select Proceed to Payment. Checkout is handled by Paystack. We verify the transaction on our server before anything is marked as paid. Never pay from a link in an email or chat message.'],
  ['Can I pay in instalments?','The data model supports partial payments, but the default launch rule is full payment of the invoice. Ask us if you need a payment plan — it can be enabled per invoice by an authorised finance user.'],
  ['What do you need from me to start?','Your book details (title, genre, publication status, ISBN if you have one), retailer links, cover and brand assets, and a clear statement of your goal. Unpublished books without an ISBN are fine.'],
  ['Will you work with any book?','We work across fiction and non-fiction, but some services have eligibility requirements — for example Amazon A+ Content requires Brand Registry. We check eligibility before issuing a proposal.'],
  ['Can I see the work in progress?','Yes. Approved client-visible milestones, deliverables and progress updates appear in your portal. Internal staff notes, drafts pending review and other clients’ records are never visible to you.'],
  ['What if I want changes?','Deliverables are versioned. You can approve or request revisions within the scope agreed in your proposal. Each version and decision is recorded, so history is never lost.'],
  ['Who owns the final files?','You do. Source files and reports are handed over. Your accounts, website and assets remain under your control.'],
  ['How are campaigns reported?','We separate completed work, campaign activity, observed results and outcomes that depend on external platforms. Imported metrics are labelled with their source, date range and methodology.'],
  ['Is Author Reach Studio a separate company?','Author Reach Studio is a specialist brand of Tredex. It is not automatically a separate legal subsidiary. Contracts, invoices and payment-recipient details name the actual registered service provider.'],
  ['How is my data protected?','Access is controlled by role and by your relationship to each record, enforced by database row-level security and server-side checks. Private files live in private storage with short-lived signed links. Sensitive changes are written to an append-only audit log.'],
];

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Questions authors ask us."
        lead="Straight answers about scope, pricing, payments, reporting and data. If yours is not here, ask us directly." crumbs={[{label:'FAQ'}]} />
      <section className="section">
        <div className="container-narrow">
          {faqs.map(([q,a],i) => (
            <details key={q} open={i === 0} style={{borderBottom:'1px solid var(--line)',padding:'18px 0'}}>
              <summary style={{cursor:'pointer',fontWeight:650,fontSize:'1rem',listStyle:'none',display:'flex',justifyContent:'space-between',gap:16}}>
                {q}<span style={{color:'var(--brand)',flex:'none'}}>+</span>
              </summary>
              <p style={{margin:'14px 0 0',color:'var(--muted)',fontSize:'.93rem',maxWidth:'68ch'}}>{a}</p>
            </details>
          ))}
          <div className="card" style={{marginTop:36,textAlign:'center'}}>
            <h3>Still have a question?</h3>
            <p>We would rather answer it before you commit to anything.</p>
            <Link href="/contact" className="btn btn-primary btn-sm">Ask us →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
