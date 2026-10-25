import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services } from '@/lib/demo-data';
import { Badge, Crumbs } from '@/components/ui';
import { InquiryForm } from '@/components/inquiry-form';

export function generateStaticParams() { return services.map(s => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find(x => x.slug === slug);
  return s ? { title:s.name, description:s.shortPromise } : { title:'Service not found' };
}

export default async function ServiceDetail({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const s = services.find(x => x.slug === slug);
  if (!s) notFound();
  const others = services.filter(x => x.slug !== slug).slice(0,3);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{label:'Services',href:'/services'},{label:s.name}]} />
          <p className="eyebrow">Service {s.icon} · {s.category}</p>
          <h1 style={{maxWidth:'20ch'}}>{s.name}</h1>
          <p className="lead">{s.shortPromise}</p>
          <div className="row" style={{marginTop:24}}>
            <Link href="#enquire" className="btn btn-primary">Enquire about this service →</Link>
            <Badge tone="teal">{s.pricing}</Badge>
            <Badge>{s.duration}</Badge>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>What this service does</h2>
            <p className="lead" style={{fontSize:'1.05rem'}}>{s.description}</p>
            <div className="notice" style={{marginTop:26}}><strong>Eligibility.</strong>&nbsp; {s.eligibility} We check this before any proposal is issued, so you never pay for work that cannot be delivered.</div>
            <h3 style={{marginTop:36}}>Scope of work</h3>
            <ul style={{paddingLeft:20,color:'var(--ink-2)',fontSize:'.93rem',lineHeight:2}}>{s.scope.map(x => <li key={x}>{x}</li>)}</ul>
            <h3 style={{marginTop:28}}>What you receive</h3>
            <div className="grid grid-3" style={{gap:12}}>
              {s.deliverables.map(d => <div className="card" key={d} style={{padding:16}}><span className="small" style={{fontWeight:650}}>{d}</span></div>)}
            </div>
          </div>
          <div>
            <div className="card" style={{position:'sticky',top:96}}>
              <div className="small faint" style={{letterSpacing:'.1em',fontWeight:700}}>AT A GLANCE</div>
              <div style={{height:1,background:'var(--line)',margin:'14px 0'}}/>
              {[['Category',s.category],['Typical duration',s.duration],['Pricing',s.pricing],['Eligibility',s.eligibility]].map(([k,v]) => (
                <div key={k} style={{marginBottom:16}}><div className="small faint">{k}</div><div style={{fontSize:'.9rem',fontWeight:600}}>{v}</div></div>
              ))}
              <Link href="#enquire" className="btn btn-primary" style={{width:'100%'}}>Enquire now →</Link>
              <p className="small faint" style={{margin:'12px 0 0',textAlign:'center'}}>No obligation. We reply within 2 business days.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <p className="eyebrow" style={{color:'var(--brand-2)'}}>Our promise on outcomes</p>
          <h2 style={{maxWidth:'24ch'}}>We report work, activity and observed results — separately.</h2>
          <p className="lead" style={{maxWidth:'70ch'}}>Where a result depends on Amazon, Goodreads, a retailer, an ad platform or reader behaviour, we label it as externally reported data with its source and date range. We never present marketing activity as guaranteed sales.</p>
        </div>
      </section>

      <section className="section" id="enquire">
        <div className="container split">
          <div>
            <p className="eyebrow">Enquire</p><h2>Tell us about your book.</h2>
            <p className="lead">Share a few details and we will confirm eligibility, suggest a scope and send a written proposal before any payment is requested.</p>
            <div className="notice notice-teal" style={{marginTop:24}}><span><strong>Invoices only come after a proposal.</strong> You will never be asked to pay from a chat message or an unsolicited link. All payments are made from inside your secure client portal.</span></div>
          </div>
          <InquiryForm variant="service" />
        </div>
      </section>

      <section className="section-tight" style={{borderTop:'1px solid var(--line)'}}>
        <div className="container">
          <h3 style={{marginBottom:18}}>Other services</h3>
          <div className="grid grid-3">
            {others.map(o => <Link href={`/services/${o.slug}`} className="card card-hover" key={o.slug}><div className="small faint">{o.category}</div><h3 style={{fontSize:'1.05rem',marginTop:8}}>{o.name}</h3><p>{o.shortPromise}</p></Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
