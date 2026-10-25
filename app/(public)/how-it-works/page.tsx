import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui';
export const metadata: Metadata = { title:'How it works', description:'Our five-stage engagement process, from enquiry to final report.' };

const steps = [
  { n:'01', t:'Enquiry & discovery', who:'You + Client Relations', b:'You tell us about your book, your audience and what you have already tried. We check eligibility and ask the questions that matter.', out:'A qualified brief in our CRM.' },
  { n:'02', t:'Proposal & scope', who:'Author Reach Studio', b:'We produce a written proposal with a defined scope, deliverables, timeline, price, currency, terms and a validity period. Every version is preserved.', out:'A versioned proposal you can accept online.' },
  { n:'03', t:'Project setup', who:'Project Management', b:'On acceptance we create the engagement, project, milestones and tasks, then assign the right specialists from the relevant departments.', out:'A visible project in your client portal.' },
  { n:'04', t:'Delivery & review', who:'Creative, Research, Marketing', b:'Work is produced, uploaded as versioned deliverables, reviewed internally and only then shared with you for approval or revision.', out:'Approved deliverables you can download.' },
  { n:'05', t:'Reporting & handover', who:'Project Management', b:'You receive the files, a completion report and — for campaigns — an honest account of activity and observed results with sources and date ranges.', out:'A report, source files and a clear next step.' },
];

export default function HowItWorks() {
  return (
    <>
      <PageHero eyebrow="How it works" title="A defined process, with an owner at every step."
        lead="No black boxes. You will always know what is happening, who is responsible, what you need to approve and what happens next." crumbs={[{label:'How it works'}]} />
      <section className="section">
        <div className="container">
          <div className="stack" style={{gap:0}}>
            {steps.map(s => (
              <div key={s.n} className="split" style={{borderTop:'1px solid var(--line)',padding:'30px 0',gap:40}}>
                <div className="row" style={{alignItems:'flex-start',flexWrap:'nowrap'}}>
                  <span className="step-num" style={{margin:0,flex:'none'}}>{s.n}</span>
                  <div><h3 style={{fontSize:'1.35rem'}}>{s.t}</h3><div className="small faint" style={{letterSpacing:'.08em',textTransform:'uppercase',fontWeight:700}}>{s.who}</div></div>
                </div>
                <div><p>{s.b}</p><div className="notice notice-teal" style={{fontSize:'.82rem'}}><strong>Output:</strong>&nbsp;{s.out}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section band">
        <div className="container grid grid-3">
          {[
            ['Proposals are versioned','Later edits to the service catalogue never silently change an accepted proposal.'],
            ['Payments are verified','Only a server-verified Paystack transaction can change an invoice’s financial state.'],
            ['Access is restricted','You see your books, projects and invoices. Internal notes and other clients’ records stay private.'],
          ].map(([t,b]) => <div className="card" key={t}><h3>{t}</h3><p>{b}</p></div>)}
        </div>
      </section>
      <section className="section center"><div className="container center"><h2>Ready to begin?</h2><p className="lead" style={{margin:'0 auto 24px'}}>Start with a short enquiry. There is no obligation and no pressure.</p><Link href="/contact" className="btn btn-primary">Send an enquiry →</Link></div></section>
    </>
  );
}
