import Link from 'next/link';
import type { Metadata } from 'next';
import { ArsLogo, TredexLogo } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';
import { PageHero, Badge, EmptyState, Progress, Ring } from '@/components/ui';
export const metadata: Metadata = { title:'Design system', description:'Author Reach Studio visual language — orange/white brand, light & dark themes, real logos and UI components.' };

const swatches = [
  ['#F4761F','Brand orange','Primary actions, active nav, highlights','--brand'],
  ['#FF9A45','Orange light','Gradient start, hover states','--brand-2'],
  ['#C2550B','Orange dark','Text on light surfaces, links','--brand-dark'],
  ['#FFF1E5','Orange soft','Callouts, icon tiles, badges','--brand-soft'],
  ['#FFFFFF','White','Cards and panels (light theme)','--surface'],
  ['#F5F7FA','Canvas','Page background (light theme)','--bg'],
  ['#101828','Ink','Primary text (light theme)','--ink'],
  ['#667085','Muted','Secondary text','--muted'],
  ['#E6EAF1','Line','Borders and dividers','--line'],
  ['#0E1524','Sidebar','Dark nav in both themes','--sidebar'],
  ['#0A101B','Dark canvas','Page background (dark theme)','--bg dark'],
  ['#111A29','Dark surface','Cards in dark theme','--surface dark'],
  ['#0E9F6E','Success','Approved, paid, verified','--ok'],
  ['#D97706','Warning','In review, due soon','--warn'],
  ['#DC2626','Danger','Overdue, blocked','--danger'],
  ['#3568E8','Info','In progress, external data','--info'],
];

export default function DesignSystemPage() {
  return (
    <>
      <PageHero eyebrow="Design review · v2" title="One brand. Two themes. Every screen."
        lead="The new visual system: Tredex orange and white as the brand base, with light and dark themes that share the same components. Real logos from your Drive, dashboard-inspired structure from the three reference boards, and nothing that looks generic."
        crumbs={[{label:'Design system'}]} />
      <section className="section">
        <div className="container">
          <div className="callout" style={{marginBottom:36}}>
            <span className="co-ico">◐</span>
            <div><h4>Try the theme switcher</h4><p>This whole site — public pages, all three dashboards and the invoice — supports light and dark. Use the toggle in the header (or here) and your choice is remembered in this browser.</p>
            <div className="row" style={{marginTop:12}}><ThemeToggle /><span className="small faint">Toggle light / dark</span></div></div>
          </div>

          <h2>1. Real brand assets</h2>
          <p className="lead" style={{marginBottom:26}}>Both logos come directly from your Google Drive folder. The transparent ARS logo also generates the favicon.</p>
          <div className="grid grid-4" style={{marginBottom:16}}>
            <div className="asset-card"><div className="frame"><img src="/logo-ars.png" alt="ARS logo light"/></div><h4 style={{fontFamily:'var(--sans)',fontSize:'.82rem'}}>ARS logo</h4><p className="small faint" style={{margin:0}}>For light surfaces</p></div>
            <div className="asset-card"><div className="frame dark"><img src="/logo-ars-white.png" alt="ARS logo dark"/></div><h4 style={{fontFamily:'var(--sans)',fontSize:'.82rem'}}>ARS logo (white)</h4><p className="small faint" style={{margin:0}}>For dark surfaces</p></div>
            <div className="asset-card"><div className="frame dark"><img src="/icon.png" alt="Favicon" style={{height:56,width:56,borderRadius:12}}/></div><h4 style={{fontFamily:'var(--sans)',fontSize:'.82rem'}}>Favicon</h4><p className="small faint" style={{margin:0}}>AR mark on orange</p></div>
            <div className="asset-card"><div className="frame"><TredexLogo size={72}/></div><h4 style={{fontFamily:'var(--sans)',fontSize:'.82rem'}}>Tredex logo</h4><p className="small faint" style={{margin:0}}>Parent brand · source of orange</p></div>
          </div>
          <div className="row" style={{alignItems:'center',gap:20,padding:18,background:'var(--surface)',border:'1px solid var(--line)',borderRadius:'var(--r)'}}>
            <ArsLogo height={54}/><span className="small muted">+ </span><TredexLogo size={44}/>
            <span className="small muted" style={{flex:1,minWidth:200}}>Author Reach Studio is a specialist brand of Tredex.</span>
          </div>

          <h2 style={{marginTop:56}}>2. Colour system</h2>
          <p className="lead">Orange and white lead. Dark navy provides the tech-product structure (sidebars, dark bands). Status colours are never the only signal — badges always carry text.</p>
          <div className="swatches" style={{marginTop:24}}>
            {swatches.map(([hex,name,use,token]) => (
              <div className="swatch" key={hex}><div className="chip" style={{background:hex}}/><div className="meta"><strong>{name}</strong><span className="faint">{hex} · {token}</span><br/><span className="faint">{use}</span></div></div>
            ))}
          </div>
          <div className="specimen" style={{marginTop:20}}><div className="specimen-label">Brand gradient</div>
            <div style={{height:64,borderRadius:12,background:'var(--brand-grad)'}}/>
            <p className="small faint" style={{margin:'10px 0 0'}}>Used for primary buttons, hero banners, progress bars and the payment card header.</p>
          </div>

          <h2 style={{marginTop:56}}>3. Typography</h2>
          <p className="lead">A serif for voice, a system sans for interface. No external font files — instant load, works offline in the preview.</p>
          <div style={{marginTop:24}}>
            {[['Display','h1','Books deserve smart marketing.'],['Section','h2','Eight ways we help authors get found.'],['Card title','h3','Book Discoverability & Metadata'],['Body','p','We report completed work, campaign activity and observed results separately.'],['Caption','small','Last updated 25 October 2026 · Source: platform-reported']].map(([tag,el,text])=>(
              <div className="type-row" key={tag}><span className="tag">{tag} / {el}</span><span style={{fontFamily:['h1','h2','h3'].includes(el)?'var(--serif)':'var(--sans)',fontSize:el==='h1'?'clamp(1.6rem,3vw,2.5rem)':el==='h2'?'1.7rem':el==='h3'?'1.2rem':el==='small'?'.8rem':'1rem',fontWeight:el==='p'?400:600,color:el==='small'?'var(--faint)':'var(--ink)'}}>{text}</span></div>
            ))}
          </div>

          <h2 style={{marginTop:56}}>4. Buttons, badges &amp; status</h2>
          <div className="specimen"><div className="specimen-label">Buttons</div>
            <div className="row"><Link href="/contact" className="btn btn-primary">Start a project →</Link><Link href="/services" className="btn btn-outline">Explore services</Link><Link href="/" className="btn btn-dark">Dark button</Link><Link href="/" className="btn btn-ghost">Text link →</Link><Link href="/" className="btn btn-primary btn-sm">Small primary</Link></div>
            <p className="small faint" style={{margin:'18px 0 0'}}>A 3px visible focus ring is defined globally for keyboard users.</p>
          </div>
          <div className="specimen"><div className="specimen-label">Status badges — text + colour, never colour alone</div>
            <div className="row"><Badge tone="ok">Approved</Badge><Badge tone="warn">In review</Badge><Badge tone="danger">Overdue</Badge><Badge tone="info">In progress</Badge><Badge tone="teal">Active client</Badge><Badge tone="neutral">Draft</Badge><Badge tone="brass">Awaiting decision</Badge></div>
          </div>

          <h2 style={{marginTop:56}}>5. Dashboard structure</h2>
          <p className="lead">Borrowed from your three reference boards: a coloured hero banner, KPI tiles with icon chips, quick-action cards, panels and dense-but-readable tables.</p>
          <div className="specimen">
            <div className="hero-banner" style={{marginBottom:18}}><div className="spread"><div><h2>Good morning, Amara 👋</h2><p>2 active projects · 1 deliverable waiting for your review.</p></div><Ring value={68}/></div></div>
            <div className="kpis" style={{marginBottom:18}}>
              {[['Active projects','2','◧'],['Pending approvals','1','✓'],['Balance due','$1,450','◈'],['Files available','18','▧']].map(([l,v,i])=>(
                <div className="kpi" key={l}><span className="kpi-icon">{i}</span><div className="label">{l}</div><div className="value">{v}</div></div>
              ))}
            </div>
            <div className="quick-grid" style={{marginBottom:0}}>
              {[['▣','My projects','2 active'],['▦','Proposals','1 awaiting'],['◈','Pay invoice','1 due'],['▧','Files','1 to review']].map(([i,l,s])=>(
                <div className="quick-card" key={l}><span className="qi">{i}</span><span><b>{l}</b><span>{s}</span></span></div>
              ))}
            </div>
          </div>
          <div className="split">
            <div className="specimen"><div className="specimen-label">Progress</div>
              {[['On track',68,''],['Needs attention',91,'warn'],['At risk',32,'danger']].map(([l,v,t])=>(
                <div key={l} style={{marginBottom:18}}><div className="spread" style={{marginBottom:8}}><span className="small">{l}</span><span className="small faint">{v}%</span></div><Progress value={Number(v)} tone={String(t)}/></div>
              ))}
              <p className="small faint" style={{margin:0}}>Progress is derived from milestones and approved tasks in the live system.</p>
            </div>
            <div className="specimen"><div className="specimen-label">Empty state</div>
              <EmptyState title="No case studies published yet" body="We only show genuine projects with written client permission. Placeholder logos and invented results are not used." action={<Link href="/contact" className="btn btn-outline btn-sm">Ask about our experience →</Link>}/>
            </div>
          </div>
          <div className="specimen"><div className="specimen-label">Table</div>
            <div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody><tr><td><strong>ARS-2026-0041</strong><span className="sub">Launch programme — phase 1</span></td><td>Amara Nwosu</td><td className="money">$1,450</td><td><Badge tone="warn">Outstanding</Badge></td></tr>
              <tr><td><strong>ARS-2026-0038</strong><span className="sub">Discoverability</span></td><td>Amara Nwosu</td><td className="money">$850</td><td><Badge tone="ok">Paid</Badge></td></tr></tbody></table></div>
          </div>

          <h2 style={{marginTop:56}}>6. The invoice</h2>
          <p className="lead">The invoice is a real document, not a dashboard widget: branded header, bill-from / bill-to, line items, totals, a payment card and print styles that hide the app chrome.</p>
          <div className="specimen"><div className="row" style={{justifyContent:'space-between'}}>
            <div><strong className="small">/portal/invoices/inv-1</strong><p className="small faint" style={{margin:'4px 0 0'}}>Use “Print / Save PDF” to export a clean A4 invoice.</p></div>
            <Link href="/portal/invoices/inv-1" className="btn btn-primary btn-sm">Open invoice →</Link>
          </div></div>

          <h2 style={{marginTop:56}}>7. Responsive &amp; accessibility</h2>
          <div className="grid grid-2">
            {[
              ['Breakpoints','Four-column grids collapse to two at 1100px and one at 680px. Dashboards switch from a fixed sidebar to a horizontal nav. Tables scroll horizontally rather than squashing.'],
              ['Keyboard','Every interactive element has a visible focus ring. Menus use native <details> so they work without JavaScript. Forms use real labels, not placeholders.'],
              ['Contrast','Ink #101828 on white is ~16:1. Orange #F4761F is used for fills and large text; body copy never sits on it. White text on the orange gradient is ~3.2:1 for large display type.'],
              ['Motion','Only subtle 0.15–0.2s hover lifts. No autoplaying animation, no parallax, no flashing content. Theme changes are instant with a 0.2s colour transition.'],
            ].map(([t,b])=><div className="card" key={t}><h3 style={{fontSize:'1.05rem'}}>{t}</h3><p>{b}</p></div>)}
          </div>

          <div className="callout" style={{marginTop:40}}><span className="co-ico">✳</span><div><h4>Still useful to have</h4><p>A vector (SVG/AI/EPS) version of the ARS logo for crisp retina rendering, the exact hex values if they differ from the sampled #F4761F, and any font files you want used. Everything else is already wired in and adjustable from one CSS file.</p><Link href="/contact" className="btn btn-primary btn-sm" style={{marginTop:12}}>Send brand pack →</Link></div></div>
        </div>
      </section>
    </>
  );
}
