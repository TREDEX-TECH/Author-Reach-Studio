import Link from 'next/link';
import { ArsLogo, TredexLogo } from './brand';
import { footerNav } from '@/lib/navigation';
import { BRAND } from '@/lib/demo-data';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{color:'#fff',marginBottom:16}}><ArsLogo height={52} /></div>
            <p style={{fontSize:'.88rem',color:'#A7B6CC',maxWidth:'36ch'}}>
              Book marketing, discoverability and author-brand support for writers who want their work to reach the right readers.
            </p>
            <div className="footer-partner">
              <TredexLogo size={52} />
              <div><div className="small" style={{color:'#fff',fontWeight:700}}>A Tredex brand</div>
              <div className="small" style={{color:'#8896AE',fontSize:'.76rem'}}>{BRAND.relationship}</div></div>
            </div>
            <p style={{fontSize:'.8rem',color:'#8896AE',marginTop:18}}>{BRAND.email}<br/>{BRAND.address}</p>
          </div>
          {footerNav.map(col => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>{col.links.map(l => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {BRAND.name}. {BRAND.relationship}</span>
          <span>We do not promise guaranteed sales, rankings or visibility outcomes.</span>
        </div>
      </div>
    </footer>
  );
}
