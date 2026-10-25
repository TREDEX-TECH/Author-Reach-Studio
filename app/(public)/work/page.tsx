import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero, EmptyState } from '@/components/ui';
export const metadata: Metadata = { title:'Our work', description:'Selected Author Reach Studio work and case studies — published only with client permission.' };

export default function WorkPage() {
  return (
    <>
      <PageHero eyebrow="Our work" title="Case studies, published honestly."
        lead="We only show projects with written client permission, and we only report results we can evidence. Until that library is approved for publication, here is exactly what our case studies will contain." crumbs={[{label:'Our work'}]} />
      <section className="section">
        <div className="container">
          <div className="card" style={{padding:0,marginBottom:28}}>
            <EmptyState icon="▤" title="Selected work is being prepared for publication"
              body="We are requesting permission from clients before publishing names, covers and results. We will not use placeholder logos or invented numbers in the meantime."
              action={<Link href="/contact" className="btn btn-outline btn-sm">Ask us about relevant experience →</Link>} />
          </div>
          <h2>What every case study will show</h2>
          <p className="lead" style={{marginBottom:28}}>A consistent structure that separates our work from market outcomes.</p>
          <div className="grid grid-2">
            {[
              ['The brief','The author’s starting point, the book, the audience and the specific problem we were asked to solve.'],
              ['What we did','The services delivered, the scope, the timeline and the departments involved — all verifiable from project records.'],
              ['Campaign activity','Assets produced, channels used, publishing schedule and outreach effort, with dates.'],
              ['Observed results','Metrics with source, date range and methodology. Imported platform data is labelled as reported, not independently verified.'],
              ['What we cannot claim','No implied causal link between our activity and sales unless the evidence supports it. No guaranteed rankings or visibility.'],
              ['Client permission','Published only where the client has approved the use of their name, cover and figures.'],
            ].map(([t,b]) => <div className="card" key={t}><h3 style={{fontSize:'1.06rem'}}>{t}</h3><p>{b}</p></div>)}
          </div>
          <div className="notice" style={{marginTop:28}}><strong>Transparency note.</strong>&nbsp; Book sales and ranking outcomes depend on external platforms, reviewers and audiences. Our reports distinguish work completed, activity delivered, observed results, and outcomes outside our control.</div>
        </div>
      </section>
    </>
  );
}
