import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
export default function AdminClients(){
  const rows = [
    ['Amara Nwosu','amara@example.com','3 books','2 active','Active client','Tola A.'],
    ['Daniel Adeyemi','daniel@example.com','1 book','—','Qualified','Unassigned'],
    ['Grace Eze','grace@example.com','2 books','1 active','Proposal sent','Chidi O.'],
    ['Femi Balogun','femi@example.com','1 book','—','Contacted','Tola A.'],
    ['Ngozi Umeh','ngozi@example.com','4 books','1 active','Active client','Tola A.'],
  ].map(([n,e,b,p,s,o])=>[<span><strong>{n}</strong><span className="sub">{e}</span></span>,b,p,
    <Badge tone={s.startsWith('Active')?'ok':s==='Qualified'?'teal':'warn'}>{s}</Badge>,o,
    <a href="#" className="btn btn-outline btn-sm">Open</a>]);
  return <>
    <AppHead title="Clients & authors" subtitle="A client is an entity, distinct from the person who logs in — supporting co-authors, assistants and publisher reps."/>
    <KpiRow items={[{label:'Active clients',value:'18'},{label:'Books on file',value:'41'},{label:'New this month',value:'6'},{label:'Inactive',value:'4'}]}/>
    <Panel title="Client records" flush><SimpleTable columns={['Author / entity','Books','Projects','Stage','Relationship manager','']} rows={rows}/></Panel>
    <div className="notice notice-teal"><span><strong>Access isolation is tested.</strong> Before launch we create two author test users and verify that Author A cannot fetch Author B’s invoice, book, file or conversation by changing an ID in a request.</span></div>
  </>;
}
