import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { EmptyRecords } from '@/components/empty-records';
import { getSnapshot } from '@/lib/data/live';
export default async function PortalBooks(){
  const s = await getSnapshot();
  return <>
    <AppHead title="My books" subtitle="Manage your author identity and book records. Unpublished books do not need an ISBN."
      action={<Link href="/contact" className="btn btn-primary btn-sm">Request a book record →</Link>}/>
    <KpiRow items={[{label:'Books on file',value:String(s.counts.books)},
      {label:'Published',value:String(s.books.filter(b=>/published/i.test(b.status)).length)},
      {label:'Pre-publication',value:String(s.books.filter(b=>!/published/i.test(b.status)).length)},
      {label:'Linked projects',value:String(s.counts.projects)}]}/>
    {s.books.length ? <div className="grid grid-2">{s.books.map(b=>(
      <Panel key={b.id} title={b.title} action={<Badge tone={b.status.startsWith('Published')?'ok':'warn'}>{b.status}</Badge>}>
        <div className="metric-row"><span>Subtitle</span><strong>{b.subtitle||'—'}</strong></div>
        <div className="metric-row"><span>Genre / categories</span><strong>{b.genre}</strong></div>
        <div className="metric-row"><span>ISBN / identifier</span><strong>{b.isbn}</strong></div>
        <div className="metric-row"><span>Target audience</span><strong>{b.audience}</strong></div>
        <div className="row" style={{marginTop:18}}><Link href="/portal/files" className="btn btn-ghost btn-sm">Book assets →</Link></div>
      </Panel>))}</div>
      : <Panel title="Your books"><EmptyRecords noun="books" href="/contact" action="Ask us to add a book →" /></Panel>}
    <div className="notice" style={{marginTop:4}}><strong>Optional fields are optional.</strong>&nbsp; The system does not force ISBNs, ASINs or publication dates for unpublished work. Sensitive material should only be uploaded into private storage when needed.</div>
  </>;
}
