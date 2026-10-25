import Link from 'next/link';
import { services, BRAND } from '@/lib/demo-data';
import { Badge } from '@/components/ui';

const problems = [
  { n:'01', t:'Your book is invisible to the right readers', b:'Strong writing is not enough if metadata, categories and product pages push you towards the wrong audience — or no audience at all.' },
  { n:'02', t:'Your author presence feels unfinished', b:'An outdated bio, inconsistent visuals and no central website make it hard for readers and media to take the next step.' },
  { n:'03', t:'Marketing is scattered and unmeasured', b:'Random posts and one-off graphics do not add up to a campaign. You need a plan, a schedule and an honest report of what happened.' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="pill">◆ A Tredex brand</span>
            <h1>Books deserve <span style={{color:'var(--brand)'}}>smart</span> marketing.</h1>
            <p className="lead">We bring structure, technology and honest reporting to book discoverability and author marketing — so the right readers can actually find your work.</p>
            <div className="row">
              <Link href="/contact" className="btn btn-primary">Tell us about your book →</Link>
              <Link href="/services" className="btn btn-outline">Explore our services</Link>
            </div>
            <div className="hero-note">
              <span aria-hidden="true" style={{color:'var(--brand)',fontWeight:800}}>✳</span>
              <span>We cannot guarantee sales, rankings or visibility outcomes. What we do guarantee is disciplined work, transparent reporting and honest advice about what is within our control.</span>
            </div>
          </div>

          <div className="platform-preview" aria-label="Platform preview">
            <div className="pp-top"><i/><i/><i/><span>Author Reach Studio · Platform</span></div>
            <div className="pp-body">
              <div className="pp-banner"><b>Good morning, Amara 👋</b><span>2 active projects · 1 deliverable waiting for your review</span></div>
              <div className="pp-kpis">
                <div className="pp-kpi"><b>68%</b><span>Launch progress</span></div>
                <div className="pp-kpi"><b>$1,450</b><span>Balance due</span></div>
                <div className="pp-kpi"><b>18</b><span>Files ready</span></div>
              </div>
              <div className="pp-row"><span>🚀 Launch programme — The Salt Road</span><Badge tone="brass">On track</Badge></div>
              <div className="pp-row"><span>🎨 Creative pack v3</span><Badge tone="warn">In review</Badge></div>
              <div className="pp-row" style={{display:'block'}}>
                <div className="spread" style={{fontSize:'.76rem'}}><span>Campaign milestones</span><span className="faint">68%</span></div>
                <div className="pp-bar"><i style={{width:'68%'}}/></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{borderBottom:'1px solid var(--line)',background:'var(--surface)'}}>
        <div className="container grid grid-4">
          {[['08','Specialist services'],['07','Delivery departments'],['04','Stage engagement process'],['100%','Client-owned assets & files']].map(([n,l]) => (
            <div key={l}><div className="num">{n}</div><div className="small muted" style={{marginTop:6}}>{l}</div></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">The problem we solve</p>
          <h2>Good books get lost in bad systems.</h2>
          <p className="lead" style={{marginBottom:38}}>Most authors do not have a marketing problem first. They have a positioning, discoverability and consistency problem. We fix the foundations, then build campaigns on top of them.</p>
          <div className="grid grid-3">
            {problems.map(p => (
              <div className="card card-hover" key={p.n}>
                <div className="card-icon">{p.n}</div><h3>{p.t}</h3><p>{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <div className="spread" style={{marginBottom:36}}>
            <div><p className="eyebrow">What we do</p><h2>Eight ways we help authors get found.</h2></div>
            <Link href="/services" className="btn btn-outline" style={{borderColor:'rgba(255,255,255,.28)',color:'#fff'}}>Full service catalogue →</Link>
          </div>
          <div className="grid grid-4">
            {services.slice(0,8).map(s => (
              <Link href={`/services/${s.slug}`} className="card card-hover" key={s.slug}>
                <div className="small" style={{color:'var(--brand-2)',fontWeight:800,letterSpacing:'.1em',marginBottom:12}}>{s.icon} / {s.category.toUpperCase()}</div>
                <h3 style={{fontSize:'1.05rem'}}>{s.name}</h3>
                <p>{s.shortPromise}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Built for the whole business</p>
          <h2>One platform. Four connected workspaces.</h2>
          <p className="lead" style={{marginBottom:30}}>Your enquiry becomes a client record. Your accepted proposal becomes a project. Your project produces deliverables and invoices. Everything stays connected, permissioned and auditable.</p>
          <div className="quick-grid" style={{marginBottom:26}}>
            {[
              {href:'/', icon:'◉', label:'Public website', sub:'Discover, trust, enquire'},
              {href:'/portal', icon:'◧', label:'Client portal', sub:'Books, projects, invoices'},
              {href:'/workspace', icon:'✓', label:'Team workspace', sub:'Tasks, reviews, files'},
              {href:'/admin', icon:'▥', label:'Management', sub:'CRM, finance, reports'},
            ].map(x => <Link href={x.href} className="quick-card" key={x.label}><span className="qi">{x.icon}</span><span><b>{x.label}</b><span>{x.sub}</span></span></Link>)}
          </div>
          <div className="split">
            <div>
              <h3>A real operations platform, not four separate websites.</h3>
              <p className="muted">Supabase holds one authoritative record for clients, books, services, proposals, invoices, payments, projects, tasks, departments and staff. Role-based access and row-level security keep every workspace in its lane.</p>
              <Link href="/how-it-works" className="btn btn-outline">See the full process →</Link>
            </div>
            <div className="card" style={{background:'var(--surface-3)'}}>
              {[
                ['01','Inquiry lands in CRM','Every public form is validated, spam-checked and source-tagged.'],
                ['02','Proposal → project','Accepted versions are preserved; milestones and tasks are created.'],
                ['03','Verified payments','Only a server-verified Paystack transaction changes an invoice.'],
              ].map(([n,t,b]) => (
                <div key={n} className="row" style={{padding:'12px 0',borderBottom:'1px solid var(--line)',alignItems:'flex-start',flexWrap:'nowrap'}}>
                  <span className="step-num" style={{margin:0,flex:'none'}}>{n}</span>
                  <span><strong style={{display:'block',fontSize:'.9rem'}}>{t}</strong><span className="small muted">{b}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--surface)',borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)'}}>
        <div className="container">
          <div className="notice notice-teal">
            <strong>An honest note on results.</strong>&nbsp; Book sales, rankings and platform visibility depend on external platforms, reviewers and audiences. We report completed work, campaign activity and observed results separately, with sources and date ranges. We will never invent a testimonial or promise an outcome we cannot control.
          </div>
        </div>
      </section>

      <section className="section band" style={{textAlign:'center'}}>
        <div className="container center">
          <p className="eyebrow" style={{justifyContent:'center'}}>Start here</p>
          <h2>Tell us about your book.</h2>
          <p className="lead" style={{margin:'0 auto 26px'}}>A short conversation is enough to work out whether we are the right fit and what the first step should be.</p>
          <div className="row" style={{justifyContent:'center'}}>
            <Link href="/contact" className="btn btn-primary">Request a consultation →</Link>
            <Link href="/faq" className="btn btn-outline" style={{borderColor:'rgba(255,255,255,.28)',color:'#fff'}}>Read the FAQ</Link>
          </div>
          <p className="small" style={{color:'var(--sidebar-muted)',marginTop:22}}>{BRAND.relationship}</p>
        </div>
      </section>
    </>
  );
}
