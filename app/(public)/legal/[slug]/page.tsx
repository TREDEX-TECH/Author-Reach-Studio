import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/ui';
import { BRAND } from '@/lib/demo-data';

type Doc = { title:string; intro:string; sections:{h:string;p:string[]}[] };
const docs: Record<string, Doc> = {
  privacy: { title:'Privacy Policy', intro:'DRAFT TEMPLATE — must be reviewed by your legal adviser and updated with the real registered entity details before launch.', sections:[
    { h:'1. Who we are', p:[`${BRAND.name} is a specialist brand of ${BRAND.parent}. The contracting and data-controlling entity is the registered business named in your proposal and invoice (the “Company”). Contact: ${BRAND.email}.`,'This draft intentionally leaves the registered legal name, registration number and address as placeholders. Replace them before publication.'] },
    { h:'2. What we collect', p:['Account and contact details (name, email, phone), author and book information, enquiry and message content, project files you upload, invoice and payment-transaction records, and technical security data (IP address, user agent) for audit and fraud prevention.','We do not store full card or bank details. Payments are processed by Paystack, which handles payment credentials under its own security obligations.'] },
    { h:'3. Why we use it', p:['To respond to enquiries, deliver contracted services, operate the client portal and team workspace, issue and reconcile invoices, meet legal and accounting obligations, and keep an audit trail of sensitive changes.','Our lawful bases include contract performance, legitimate interests in running and securing the platform, legal obligation, and consent where you have given it (for example, marketing emails).'] },
    { h:'4. Who can see your information', p:['Access is restricted by role and by your relationship to each record. Row-level security in our database prevents other clients from reading your records. Internal notes, cost and margin data are not visible to clients.','We share data with processors only where needed: Supabase (database, authentication, storage), Netlify (hosting and server functions), Paystack (payments), and our email provider. Each is bound by its own terms and data-protection obligations.'] },
    { h:'5. How long we keep it', p:['Operational records are kept for the life of the client relationship. Invoices, verified payment records and audit events are retained for the period required by applicable tax and company law. You may request deletion of data we are not legally required to retain.'] },
    { h:'6. Your rights', p:['You may request access to, correction of, or deletion of your personal data; object to certain processing; and withdraw consent where processing relies on consent. Contact us at the email above. We may need to verify your identity before acting.'] },
    { h:'7. Security', p:['We use encrypted transport, private storage buckets with short-lived signed links, row-level security, server-side authorisation and append-only audit records. No system is perfectly secure; we will notify affected users and regulators where the law requires.'] },
    { h:'8. Changes', p:['We may update this policy. Material changes will be notified through the portal or by email, with an updated effective date.'] },
  ]},
  terms: { title:'Terms of Service', intro:'DRAFT TEMPLATE — legal review required. Nothing here is legal advice.', sections:[
    { h:'1. The agreement', p:['These terms govern use of the Author Reach Studio website and client portal. The specific services, deliverables, price, currency, timeline and acceptance criteria for any engagement are set out in the written proposal you accept (the “Proposal”). Where these terms conflict with a signed Proposal, the Proposal prevails for that engagement.'] },
    { h:'2. No guaranteed outcomes', p:['We provide marketing, discoverability, creative and advisory services. We do not guarantee book sales, rankings, reviews, bestseller status, advertising performance or visibility on any third-party platform. Outcomes depend on external platforms, algorithms, reviewers and audiences outside our control.','Any examples, case studies or platform-reported metrics are provided for information only and are not a promise of future results.'] },
    { h:'3. Client responsibilities', p:['You confirm you own or are licensed to use all materials you supply, that your content is lawful, and that the information you provide is accurate. You are responsible for obtaining any third-party permissions needed for assets you ask us to use.'] },
    { h:'4. Platform rules', p:['Where a service involves a third-party platform (for example Amazon, Goodreads or a social network), that platform’s rules apply. We may decline or stop any activity we believe violates those rules. We are not responsible for platform decisions, suspensions or algorithm changes.'] },
    { h:'5. Fees and payment', p:['Fees are stated in the accepted Proposal and invoiced in the agreed currency. Payment is due by the invoice due date. An invoice is treated as paid only after a Paystack transaction has been verified on our server. See the Refund & Payment Policy.'] },
    { h:'6. Intellectual property', p:['On full payment, you own the final deliverables created specifically for you, together with the source files we agree to hand over. We retain ownership of our internal tools, templates, processes and pre-existing materials, and grant you a licence to use any such material embedded in your deliverables.','We may describe the engagement in general terms for our own marketing only with your written permission.'] },
    { h:'7. Confidentiality and data', p:['Each party will keep the other’s confidential information private. Our handling of personal data is described in the Privacy Policy. Client files are stored in private storage and are never publicly accessible by default.'] },
    { h:'8. Liability', p:['To the maximum extent permitted by law, our liability arising from an engagement is limited to the fees you paid for that engagement. We are not liable for indirect or consequential loss, lost sales, or third-party platform actions. Nothing excludes liability that cannot lawfully be excluded.'] },
    { h:'9. Termination', p:['Either party may terminate an engagement in accordance with the Proposal. On termination, you pay for work properly performed up to the termination date, and we hand over completed client-owned deliverables.'] },
    { h:'10. Governing law', p:['CONFIRM: insert the governing law and jurisdiction that apply to the registered service provider before publication.'] },
  ]},
  refunds: { title:'Refund & Payment Policy', intro:'DRAFT TEMPLATE — confirm against your actual business rules and Paystack settlement capabilities.', sections:[
    { h:'1. How payment works', p:['An authorised staff member issues an invoice. You review it in your client portal and select Proceed to Payment. Checkout is hosted or initialised by Paystack. We verify each transaction with Paystack on our server before the invoice status changes.','A browser redirect to a success page is not proof of payment. Only a verified transaction counts.'] },
    { h:'2. Currencies', p:['Invoices are issued in the currency stated on the invoice and supported by our Paystack merchant account. CONFIRM: list the currencies actually enabled at launch (current decision: USD only, subject to Paystack merchant verification).'] },
    { h:'3. Payment terms', p:['Invoices are due within the number of days stated on the invoice (default: 14 days). An invoice becomes overdue automatically after its due date. We may pause delivery on overdue invoices after notice.'] },
    { h:'4. Instalments', p:['The platform supports partial payments. The default launch rule is full payment of each invoice. A payment plan may be enabled per invoice by an authorised finance user and will be recorded on the invoice.'] },
    { h:'5. Refunds and cancellations', p:['Because our services involve research, creative production and reserved staff time, refunds are assessed against work already performed. Before work begins you may cancel and request a refund of amounts paid, less any non-recoverable third-party costs.','After work begins, we may refund the portion of the fee attributable to work not yet performed, calculated against the agreed scope and deliverables. Completed and approved deliverables are not refundable.','CONFIRM: insert your exact refund window and approval authority before publication.'] },
    { h:'6. Failed, duplicate and abandoned payments', p:['Failed or abandoned attempts are recorded but do not change your invoice. If you believe you were charged twice, contact us with the Paystack reference. Duplicate verified transactions are reconciled and refunded where appropriate.'] },
    { h:'7. Tax', p:['CONFIRM: state whether displayed prices are tax-inclusive and provide the tax identification number that appears on invoices.'] },
    { h:'8. Contact', p:[`For billing questions, contact ${BRAND.email} quoting your invoice number and Paystack reference.`] },
  ]},
};

export function generateStaticParams(){ return Object.keys(docs).map(slug => ({slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const d=docs[slug];
  return d?{title:d.title,description:`${d.title} — Author Reach Studio`}:{title:'Not found'};
}

export default async function LegalPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const d=docs[slug]; if(!d) notFound();
  return (
    <>
      <PageHero eyebrow="Legal" title={d.title} lead={d.intro} crumbs={[{label:d.title}]} />
      <section className="section"><div className="container-narrow legal">
        <div className="notice" style={{marginBottom:32}}><strong>Draft document.</strong>&nbsp; This is a starting template prepared for the platform, not legal advice. It must be reviewed and completed by your lawyer with the correct registered entity, jurisdiction, tax details and refund rules before going live.</div>
        {d.sections.map(s => <div key={s.h}><h2>{s.h}</h2>{s.p.map((p,i)=><p key={i}>{p}</p>)}</div>)}
        <div className="divider"/>
        <p className="small faint">Last updated: 25 October 2026 (draft). Registered service provider: to be confirmed.</p>
      </div></section>
    </>
  );
}
