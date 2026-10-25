import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, EmptyState } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
import { SITE } from '@/lib/config';
export const metadata: Metadata = { title:'Resources', description:'Practical guidance for authors on discoverability, metadata, launches and reader engagement.' };

export default async function ResourcesPage() {
  const { notifications } = await getSnapshot();
  const articles: { title:string; body:string }[] = [];
  return <>
    <PageHero eyebrow="Resources" title="Practical notes for authors."
      lead="Clear, honest guidance on discoverability, metadata, launches and reader engagement — written from our own delivery experience, not generic marketing advice."
      crumbs={[{label:'Resources'}]} />
    <section className="section"><div className="container">
      {articles.length ? (
        <div className="grid grid-3">{articles.map(a=><div className="card" key={a.title}><h3>{a.title}</h3><p>{a.body}</p></div>)}</div>
      ) : (
        <EmptyState icon="✎" title="Articles are on the way"
          body="We are writing our first guides. Until they are published, we will not fill this space with placeholder posts or recycled advice. If you have a specific question, ask us and we will answer it directly."
          action={<Link href="/contact" className="btn btn-primary btn-sm">Ask a question →</Link>} />
      )}
      <div className="notice notice-teal" style={{marginTop:30}}>
        <span><strong>No hype.</strong> We do not promise guaranteed sales, rankings or visibility. Anything we publish will distinguish completed work, campaign activity, observed results and outcomes controlled by external platforms. Questions: {SITE.email}.</span>
      </div>
      {notifications.length > 0 && <p className="small faint" style={{marginTop:16}}>{notifications.length} platform notices on file.</p>}
    </div></section>
  </>;
}
