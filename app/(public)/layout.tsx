import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="demo-banner">
        <strong>Design prototype · visual system v2.</strong> Real logos, orange/white branding and light/dark themes are applied. Content is still illustrative. <a href="/design-system" style={{color:'var(--brand-2)',textDecoration:'underline',marginLeft:6}}>Review the design system →</a>
      </div>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
