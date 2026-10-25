import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui';
import { ArsLogo, TredexLogo } from '@/components/brand';
export const metadata: Metadata = { title:'About', description:'About Author Reach Studio, a specialist author marketing brand of Tredex.' };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="A specialist studio for the business of being an author."
        lead="Author Reach Studio is the author marketing and growth brand of Tredex. We help writers close the gap between a finished book and a book that readers can actually find." crumbs={[{label:'About'}]} />
      <section className="section">
        <div className="container split">
          <div>
            <h2>Why we exist</h2>
            <p>Publishing has never been more accessible, and discoverability has never been harder. Authors are asked to be writers, brand managers, advertisers, community builders and data analysts — usually without a team.</p>
            <p>We built Author Reach Studio to bring structure to that work. Not vague promises of virality, but disciplined positioning, well-built author assets, campaigns with a schedule, and reports that distinguish what we did from what the market did.</p>
            <p>Our work spans metadata and discoverability, author and book profile optimisation, creative production, launch campaigns, reader engagement within platform rules, website development and ongoing marketing support.</p>
            <div className="notice notice-teal" style={{marginTop:24}}><span><strong>Our reporting standard.</strong> Completed work, campaign activity, observed results and externally-dependent outcomes are always reported separately — with source, date range and methodology where data is imported.</span></div>
          </div>
          <div className="stack">
            {[
              ['Clarity before activity','We fix the foundations before recommending a campaign. A beautiful graphic cannot rescue the wrong categories.'],
              ['Honesty about control','We are direct about what we can influence and what depends on Amazon, retailers, algorithms and readers.'],
              ['You own your assets','Source files, accounts, websites and reports are handed over. Nothing is held hostage to a retainer.'],
              ['Traceable work','Every deliverable has a version, every approval a record, every invoice a verified payment.'],
            ].map(([t,b]) => <div className="card" key={t}><h3 style={{fontSize:'1.08rem'}}>{t}</h3><p>{b}</p></div>)}
          </div>
        </div>
      </section>
      <section className="section band">
        <div className="container">
          <p className="eyebrow" style={{color:'var(--brand-2)'}}>Brand structure</p>
          <h2>Tredex and Author Reach Studio.</h2>
          <div className="grid grid-2" style={{marginTop:28}}>
            <div className="card"><div className="row" style={{gap:14,marginBottom:14}}><TredexLogo size={56}/><h3 style={{margin:0}}>Tredex</h3></div><p>The parent business identity. Tredex retains ownership of the platform, client relationships and commercial accounts. Its orange is the base of our visual system.</p></div>
            <div className="card"><div className="row" style={{gap:14,marginBottom:14}}><ArsLogo height={54}/></div><h3>Author Reach Studio</h3><p>The specialist author marketing brand through which these services are presented, sold and delivered.</p></div>
          </div>
          <div className="notice" style={{marginTop:24,background:'rgba(244,118,31,.12)',color:'#FFD9B8',borderColor:'var(--brand)'}}>
            <strong>Legal note.</strong>&nbsp; This branding arrangement does not create a separate legal subsidiary. Contracts, invoices and payment-recipient details must name the actual registered service provider. Confirm the exact legal entity with us before contracting.
          </div>
        </div>
      </section>
      <section className="section center">
        <div className="container center"><h2>Let’s talk about your book.</h2><p className="lead" style={{margin:'0 auto 24px'}}>One conversation is enough to find out whether we can help.</p><Link href="/contact" className="btn btn-primary">Start a conversation →</Link></div>
      </section>
    </>
  );
}
