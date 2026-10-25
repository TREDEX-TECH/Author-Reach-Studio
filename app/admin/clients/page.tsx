import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function AdminClients(){
  const s = await getSnapshot();
  const rows = s.authors.map(a=>[
    <span><strong>{a.name}</strong><span className="sub">{a.email}</span></span>,
    `${a.books} books`, `${a.projects} projects`,
    <Badge tone={a.tone}>{a.stage || a.status}</Badge>, a.manager, a.created,
  ]);
  return <>
    <AppHead title="Clients & authors" subtitle="A client is an entity, distinct from the person who logs in — supporting co-authors, assistants and publisher reps."/>
    <KpiRow items={[
      {label:'Client records',value:String(s.counts.authors)},
      {label:'Books on file',value:String(s.counts.books)},
      {label:'Projects',value:String(s.counts.projects)},
      {label:'Invoices',value:String(s.counts.invoices)},
    ]}/>
    <Panel title="Client records" flush><SimpleTable columns={['Author / entity','Books','Projects','Stage','Relationship manager','Created']} rows={rows}
      empty={{title:'No client records yet',body:'Client records are created from accepted enquiries and proposals. No fictional clients, books or contact details are displayed.'}}/></Panel>
    <div className="notice notice-teal"><span><strong>Access isolation is enforced.</strong> Row-level security prevents one author account from reading another client’s invoices, books, files or conversations by changing an ID in a request. Test this with two real client accounts before operational launch.</span></div>
  </>;
}
