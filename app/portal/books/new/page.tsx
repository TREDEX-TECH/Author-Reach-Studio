import Link from 'next/link';
import type { Metadata } from 'next';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel } from '@/components/ui';
import { SITE } from '@/lib/config';
export const metadata: Metadata = { title:'Book records', description:'How Author Reach Studio creates and maintains client book records.' };
export default function NewBookPage(){
  return <>
    <AppHead title="Book records" subtitle="Book details are created as part of client onboarding and kept with your project."/>
    <KpiRow items={[{label:'ISBN required?',value:'No'},{label:'Unpublished books',value:'Supported'},{label:'Private by default',value:'Yes'},{label:'Support',value:SITE.email}]}/>
    <Panel title="How to add or update a book"><p className="small muted" style={{marginTop:0}}>Tell your project team the title, subtitle, genre, publication status and any identifiers you already have. We will create or update the book record against your client account. Unpublished books do not need an ISBN, ASIN or retailer ID.</p>
      <div className="metric-row"><span>Optional fields</span><strong>Subtitle, ISBN, ASIN, cover, synopsis</strong></div>
      <div className="metric-row"><span>Sensitive files</span><strong>Private storage only</strong></div>
      <div className="metric-row"><span>Other clients’ books</span><strong>Never visible</strong></div>
      <div className="row" style={{marginTop:18}}><Link href="/contact" className="btn btn-primary btn-sm">Send book details →</Link><Link href="/portal/books" className="btn btn-outline btn-sm">Back to my books</Link></div>
    </Panel>
  </>;
}
