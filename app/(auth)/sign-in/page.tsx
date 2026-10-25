import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArsLogo, TredexLogo } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthForm } from '@/components/auth-form';
import { SITE } from '@/lib/config';
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
          <TredexLogo size={34}/><span>{SITE.relationship}</span>
        </div>
      </div>
      <div style={{display:'grid',placeItems:'center',padding:32,background:'var(--bg)',position:'relative'}}>
        <div style={{position:'absolute',top:24,right:24}}><ThemeToggle/></div>
        <div style={{width:'min(420px,100%)'}}>
          <h2 style={{fontSize:'1.8rem'}}>Sign in</h2>
          <p className="muted" style={{fontSize:'.9rem'}}>Use the email address your invitation was sent to.</p>
          <Suspense fallback={<div className="small faint">Loading sign-in…</div>}><AuthForm /></Suspense>
          <div className="notice notice-teal" style={{marginTop:22,fontSize:'.82rem'}}>
            <span><strong>Invitation only.</strong> Accounts are created by an administrator. If you need access, contact {SITE.email}. Never share your password — we will never ask for it.</span>
          </div>
          <div className="row" style={{marginTop:24,justifyContent:'space-between'}}>
            <Link href="/" className="small muted">← Back to website</Link>
            <Link href="/contact" className="small muted">Request access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
