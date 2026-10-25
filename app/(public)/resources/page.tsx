import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero, Badge } from '@/components/ui';
export const metadata: Metadata = { title:'Resources', description:'Practical guides for authors on metadata, discoverability, launch planning and book marketing.' };

const posts = [
  { t:'Why your book categories matter more than your cover', c:'Discoverability', d:'8 min read', s:'Draft' },
  { t:'A realistic six-week book launch timeline', c:'Launch planning', d:'11 min read', s:'Draft' },
  { t:'What Amazon A+ Content can and cannot do', c:'Retail pages', d:'6 min read', s:'Draft' },
  { t:'How to write an author bio readers actually finish', c:'Author brand', d:'5 min read', s:'Draft' },
  { t:'Reading a campaign report without fooling yourself', c:'Measurement', d:'9 min read', s:'Draft' },
  { t:'The difference between activity and results in book marketing', c:'Measurement', d:'7 min read', s:'Draft' },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow="Resources" title="Practical guidance for authors."
        lead="Short, honest guides on discoverability, positioning, launch planning and how to read marketing reports. No growth hacks, no guaranteed outcomes." crumbs={[{label:'Resources'}]} />
      <section className="section">
        <div className="container">
          <div className="notice notice-teal" style={{marginBottom:28}}><span><strong>Coming soon.</strong> These article topics are planned. Content must be written and reviewed before publication — we do not ship AI-generated filler under a brand that promises honesty.</span></div>
          <div className="grid grid-3">
            {posts.map(p => (
              <article className="card card-hover" key={p.t}>
                <div className="spread" style={{marginBottom:14}}><span className="small faint" style={{fontWeight:700,letterSpacing:'.08em'}}>{p.c.toUpperCase()}</span><Badge>{p.s}</Badge></div>
                <h3 style={{fontSize:'1.08rem'}}>{p.t}</h3>
                <p className="small faint" style={{margin:0}}>{p.d} · Planned</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
