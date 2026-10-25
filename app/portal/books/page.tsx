import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { books } from '@/lib/demo-data';
export default function PortalBooks(){
  return <>
    <AppHead title="My books" subtitle="Manage your author identity and book records. Unpublished books do not need an ISBN."
      action={<Link href="/portal/books/new" className="btn btn-primary btn-sm">+ Add a book</Link>}/>
    <KpiRow items={[{label:'Books on file',value:'3'},{label:'Published',value:'2'},{label:'Pre-publication',value:'1'},{label:'Linked projects',value:'3'}]}/>
    <div className="grid grid-2">
      {books.map(b=>(
        <Panel key={b.id} title={b.title} action={<Badge tone={b.status.startsWith('Published')?'ok':'warn'}>{b.status}</Badge>}>
          <div className="metric-row"><span>Subtitle</span><strong>{b.subtitle||'—'}</strong></div>
          <div className="metric-row"><span>Genre / categories</span><strong>{b.genre}</strong></div>
          <div className="metric-row"><span>ISBN / identifier</span><strong>{b.isbn}</strong></div>
          <div className="metric-row"><span>Target audience</span><strong>Readers of literary & historical fiction</strong></div>
          <div className="row" style={{marginTop:18}}>
            <Link href="/portal/books" className="btn btn-outline btn-sm">Edit details</Link>
            <Link href="/portal/files" className="btn btn-ghost btn-sm">Book assets →</Link>
          </div>
        </Panel>
      ))}
    </div>
    <div className="notice" style={{marginTop:4}}><strong>Optional fields are optional.</strong>&nbsp; The system deliberately does not force ISBNs, ASINs or publication dates for unpublished work. Sensitive or licensed material should only be uploaded when needed, into private storage.</div>
  </>;
}
