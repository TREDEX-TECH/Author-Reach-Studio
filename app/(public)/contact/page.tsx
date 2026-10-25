import type { Metadata } from 'next';
import { PageHero } from '@/components/ui';
import { InquiryForm } from '@/components/inquiry-form';
import { BRAND } from '@/lib/demo-data';
export const metadata: Metadata = { title:'Contact', description:'Contact Author Reach Studio to discuss your book and request a consultation.' };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s talk about your book."
        lead="Send a short enquiry and a real person will reply within two business days. No automated sales sequence, no obligation." crumbs={[{label:'Contact'}]} />
      <section className="section">
        <div className="container split">
          <div>
            <h2>What happens next</h2>
            <ul className="timeline" style={{marginTop:22}}>
              <li><div className="t">We read your enquiry</div><div className="d">A Client Relations team member reviews it and checks eligibility.</div></li>
              <li><div className="t">We reply with questions or a call</div><div className="d">Usually within two business days. We will ask about your book, audience and goals.</div></li>
              <li><div className="t">You receive a written proposal</div><div className="d">Scope, deliverables, timeline, price, currency and terms — nothing vague.</div></li>
              <li><div className="t">You decide</div><div className="d">Accept online from your client portal, or decline. No pressure either way.</div></li>
            </ul>
            <div className="card" style={{marginTop:28}}>
              <h3 style={{fontSize:'1.05rem'}}>Direct contact</h3>
              <p className="small" style={{marginBottom:6}}><strong>Email:</strong> {BRAND.email}</p>
              <p className="small" style={{marginBottom:6}}><strong>Phone / WhatsApp:</strong> {BRAND.phone}</p>
              <p className="small" style={{marginBottom:0}}><strong>Office:</strong> {BRAND.address}</p>
            </div>
            <div className="notice" style={{marginTop:20}}><strong>Payment safety.</strong>&nbsp; We will never ask you to pay from a link in a chat message. Invoices are only paid from inside your client portal, and a browser “success” screen is never treated as proof of payment.</div>
          </div>
          <InquiryForm variant="consultation" />
        </div>
      </section>
    </>
  );
}
