import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, EmptyState } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export const metadata: Metadata = { title:'Our work', description:'Selected Author Reach Studio engagements, published only with client permission.' };

export default async function WorkPage() {
  const { projects } = await getSnapshot();
  const published = projects.filter(p => p.status.toLowerCase().includes('completed'));
  return <>
    <PageHero eyebrow="Our work" title="Work we can actually show."
      lead="We publish case studies only with written client permission, and we label every result with its source and date range. No invented numbers, logos or testimonials — ever."
      crumbs={[{label:'Our work'}]} />
    <section className="section"><div className="container">
      {published.length ? (
        <div className="grid grid-2">{published.map(p=><div className="card" key={p.id}><h3>{p.name}</h3><p>{p.book} · {p.status}</p></div>)}</div>
      ) : (
        <EmptyState icon="◈" title="No published case studies yet"
          body="We ask clients for permission before publishing names, covers and results, and we will not use placeholder logos or invented figures while we wait. Ask us about relevant experience and we will describe it honestly, including what we cannot show."
          action={<Link href="/contact" className="btn btn-outline btn-sm">Ask about our experience →</Link>} />
      )}
    </div></section>
  </>;
}
