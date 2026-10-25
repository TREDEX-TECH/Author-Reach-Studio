import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
export default function WorkspaceFiles(){
  const rows = [
    ['Launch creative pack v3.zip','ZIP','18.4 MB','The Salt Road','24 Oct 2026','Internal','warn'],
    ['A+ module copy deck v3.docx','DOCX','1.2 MB','The Salt Road','24 Oct 2026','Internal','warn'],
    ['Homepage proof v2.pdf','PDF','6.8 MB','Author platform refresh','23 Oct 2026','Internal','danger'],
    ['Metadata audit report.pdf','PDF','2.1 MB','Ash & Ink metadata','12 Oct 2026','Client visible','ok'],
  ].map(([n,t,s,p,d,v,tone])=>[
    <span><strong>{n}</strong><span className="sub">{t} · {s}</span></span>, p, d, <Badge tone={tone}>{v}</Badge>,
  ]);
  return <>
    <AppHead title="Files" subtitle="Upload drafts, designs, video and reports as versioned deliverables."/>
    <KpiRow items={[{label:'Files uploaded',value:'42'},{label:'Pending review',value:'3'},{label:'Approved',value:'28'},{label:'Storage used',value:'1.8 GB'}]}/>
    <Panel title="Project files" flush><SimpleTable columns={['File','Project','Uploaded','Visibility']} rows={rows}/></Panel>
    <div className="notice notice-teal"><span><strong>Large files go direct to Storage.</strong> Videos and large assets use authorised/resumable uploads straight to private Supabase Storage buckets — they are never routed through a Netlify Function body. MIME type and size are validated, and paths are scoped to the owning project.</span></div>
  </>;
}
