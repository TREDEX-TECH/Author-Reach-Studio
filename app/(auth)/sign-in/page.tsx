import Link from 'next/link';
import type { Metadata } from 'next';
import { ArsLogo, TredexLogo } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';
export const metadata: Metadata = { title:'Sign in', description:'Sign in to the Author Reach Studio client portal or team workspace.' };

export default function SignInPage() {
  return (
    <div style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'1fr 1fr'}}>
      <div style={{background:'var(--sidebar)',color:'#DCE5F2',padding:'clamp(32px,6vw,80px)',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <Link href="/" className="brand" style={{color:'#fff'}}><ArsLogo height={52}/></Link>
        <div>
          <p className="eyebrow" style={{color:'var(--brand-2)'}}>Secure access</p>
          <h2 style={{fontSize:'clamp(2rem,3.4vw,2.9rem)',color:'#fff',maxWidth:'17ch'}}>One account. Your entire engagement.</h2>
          <p style={{color:'#A7B6CC',maxWidth:'46ch'}}>View proposals, track milestones, approve deliverables, download files and pay invoices — all in one permissioned workspace.</p>
          <div className="grid grid-2" style={{gap:12,marginTop:30}}>
            {['Private client files','Verified invoice payments','Versioned deliverables','Project conversations'].map(x=>(
              <div key={x} style={{border:'1px solid var(--sidebar-line)',borderRadius:12,padding:'12px 14px',fontSize:'.85rem'}}>✓ {x}</div>
            ))}
          </div>
        </div>
        <div className="row" style={{gap:12,color:'var(--sidebar-muted)',fontSize:'.8rem'}}>
          <TredexLogo size={34}/><span>Author Reach Studio is a specialist brand of Tredex.</span>
        </div>
      </div>
      <div style={{display:'grid',placeItems:'center',padding:32,background:'var(--bg)',position:'relative'}}>
        <div style={{position:'absolute',top:24,right:24}}><ThemeToggle/></div>
        <div style={{width:'min(420px,100%)'}}>
          <div className="demo-banner" style={{borderRadius:10,marginBottom:22}}>Demo mode — authentication is not connected yet.</div>
          <h2 style={{fontSize:'1.8rem'}}>Sign in</h2>
          <p className="muted" style={{fontSize:'.9rem'}}>Use the email address your invitation was sent to.</p>
          <form className="stack" style={{marginTop:22}}>
            <div><label htmlFor="email">Work email</label><input id="email" type="email" placeholder="you@example.com" /></div>
            <div><label htmlFor="password">Password</label><input id="password" type="password" placeholder="••••••••" /></div>
            <div className="spread"><label className="checkbox"><input type="checkbox"/> Remember me</label><a href="#" className="small" style={{color:'var(--brand-dark)',fontWeight:700}}>Forgot password?</a></div>
            <Link href="/portal" className="btn btn-primary" style={{width:'100%'}}>Sign in →</Link>
          </form>
          <div className="notice notice-teal" style={{marginTop:22,fontSize:'.82rem'}}>
            <span><strong>Phase 2 wiring:</strong> Supabase Auth with email verification, password reset, an explicit redirect allowlist and invitation-only onboarding for both clients and staff.</span>
          </div>
          <div className="row" style={{marginTop:24,justifyContent:'space-between'}}>
            <Link href="/" className="small muted">← Back to website</Link>
            <div className="row" style={{gap:10}}><Link href="/workspace" className="small muted">Team</Link><Link href="/admin" className="small muted">Admin</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}
