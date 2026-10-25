import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge, EmptyState } from '@/components/ui';
export default function PortalFiles(){
  const files = [
    ['Launch creative pack v3.zip','18.4 MB','24 Oct 2026','Awaiting your review','warn'],
    ['Metadata audit report.pdf','2.1 MB','12 Oct 2026','Approved','ok'],
    ['Category & keyword set.xlsx','340 KB','12 Oct 2026','Approved','ok'],
    ['Author bio — final.docx','48 KB','08 Oct 2026','Approved','ok'],
    ['Post-launch report (Sep).pdf','1.8 MB','30 Sep 2026','Approved','ok'],
  ];
  return <>
    <AppHead title="Files & deliverables" subtitle="Review work, approve it or request revisions. Every version is kept."
      action={<Link href="/portal/files" className="btn btn-primary btn-sm">Upload requested material</Link>}/>
    <KpiRow items={[{label:'Files available',value:'18'},{label:'Awaiting review',value:'1',delta:'Action needed',negative:true},{label:'Approved',value:'15'},{label:'Uploaded by you',value:'2'}]}/>
    <div className="callout" style={{marginBottom:20}}><span className="co-ico">✳</span><div><h4>Review needed: Launch creative pack v3</h4><p>Submitted 24 Oct 2026 by the Creative Design team. Please approve it or request revisions. Once approved it becomes a client-visible deliverable and the milestone can advance.</p>
      <div className="row" style={{marginTop:12}}><Link href="/portal/files" className="btn btn-primary btn-sm">Approve</Link><Link href="/portal/files" className="btn btn-outline btn-sm">Request revisions</Link><Link href="/portal/files" className="btn btn-ghost btn-sm">Download</Link></div></div></div>
    <Panel title="Your files" flush>
      <div className="table-wrap"><table><thead><tr><th>File</th><th>Size</th><th>Added</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>{files.map(([n,s,d,st,tone])=>(
        <tr key={n}><td><div className="file-row" style={{padding:0,border:'none'}}><span className="file-ico">{n.split('.').pop()?.slice(0,3).toUpperCase()}</span><span><strong style={{fontSize:'.85rem'}}>{n}</strong></span></div></td>
        <td>{s}</td><td>{d}</td><td><Badge tone={tone}>{st}</Badge></td>
        <td><Link href="/portal/files" className="btn btn-outline btn-sm">Download</Link></td></tr>
      ))}</tbody></table></div>
    </Panel>
    <div className="notice notice-teal"><span><strong>Private by default.</strong> Your files live in private Supabase Storage buckets with short-lived signed links. A new upload creates a new version — it never overwrites the history of previous work.</span></div>
  </>;
}
