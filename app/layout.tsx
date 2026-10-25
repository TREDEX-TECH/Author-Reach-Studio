import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://authorreachstudio.com'),
  title: { default:'Author Reach Studio', template:'%s | Author Reach Studio' },
  description: 'Book discoverability, author brand development, launch campaigns and marketing support for authors. A specialist brand of Tredex.',
  keywords: ['book marketing','author brand','book discoverability','book launch','Amazon A+ Content','author website'],
  openGraph: { type:'website', siteName:'Author Reach Studio', title:'Author Reach Studio', description:'Book marketing, discoverability and author-brand support for authors. A specialist brand of Tredex.' },
  icons: { icon:'/icon.png', apple:'/apple-icon.png', shortcut:'/favicon.ico' },
  robots: { index:true, follow:true },
};
export const viewport: Viewport = { themeColor:'#F4761F', width:'device-width', initialScale:1 };

const themeInit = `(function(){try{var t=localStorage.getItem('ars-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body>{children}</body>
    </html>
  );
}
