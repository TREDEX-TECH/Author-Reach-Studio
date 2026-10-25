import Link from 'next/link';
import type { Metadata } from 'next';
import { getCatalogue } from '@/lib/data/catalogue';
import { PageHero } from '@/components/ui';
import { EmptyState } from '@/components/ui';

export const metadata: Metadata = { title:'Services', description:'Book discoverability, author branding, creative production, launch campaigns and marketing support for authors.' };

export default async function ServicesPage() {
  const { services } = await getCatalogue();
  const groups = Array.from(new Set(services.map(s => s.category)));
  return (
    <>
      <PageHero eyebrow="Service catalogue" title="Services built around how readers find books."
        lead="Every service has a defined scope, clear deliverables and an honest statement of what it can and cannot do. Pricing is either published as a starting point or provided by proposal — and the catalogue is managed by our administrators, so it stays current."
        crumbs={[{label:'Services'}]} />
      
      <section className="section">
        <div className="container stack" style={{gap:48}}>
          {!services.length && <EmptyState icon="▦" title="No published services yet" body="Our live service catalogue is empty right now. Rather than show invented prices or packages, we will publish real services here as soon as they are configured. You can still contact us to discuss your book." action={<Link href="/contact" className="btn btn-primary btn-sm">Contact us →</Link>} />}
          {groups.map(g => (
            <div key={g}>
              <div className="spread" style={{marginBottom:18}}>
                <h2 style={{fontSize:'1.5rem',margin:0}}>{g}</h2>
                <span className="small faint">{services.filter(s=>s.category===g).length} services</span>
              </div>
              <div className="grid grid-3">
                {services.filter(s=>s.category===g).map(s => (
                  <Link href={`/services/${s.slug}`} className="card card-hover" key={s.slug} style={{display:'flex',flexDirection:'column'}}>
                    <div className="small faint" style={{letterSpacing:'.1em',fontWeight:700,marginBottom:12}}>SERVICE {s.icon}</div>
                    <h3>{s.name}</h3>
                    <p style={{flex:1}}>{s.shortPromise}</p>
                    <div className="spread" style={{marginTop:18,paddingTop:14,borderTop:'1px solid var(--line)'}}>
                      <span className="small" style={{color:'var(--brand-dark)',fontWeight:700}}>{s.pricing}</span>
                      <span className="small faint">{s.duration}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section band">
        <div className="container split">
          <div><p className="eyebrow" style={{color:'var(--brand-2)'}}>Not sure where to start?</p><h2>Most authors begin with a discoverability audit.</h2><p className="lead">It gives us — and you — a clear picture of what is working before anyone recommends a campaign.</p></div>
          <div className="row" style={{alignItems:'flex-start'}}>
            <Link href="/contact" className="btn btn-brass">Request a consultation →</Link>
            <Link href="/how-it-works" className="btn btn-outline" style={{borderColor:'rgba(255,255,255,.3)',color:'#fff'}}>How it works</Link>
          </div>
        </div>
      </section>
    </>
  );
}
