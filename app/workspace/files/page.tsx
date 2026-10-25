import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function WorkspaceFiles(){
  const s = await getSnapshot();
  const rows = s.files.map(f=>[
    <span><strong>{f.name}</strong><span className="sub">{f.ext} · {f.size}</span></span>,
    f.project, f.date, <Badge tone={f.tone}>{f.visibility}</Badge>,
  ]);
  return <>
    <AppHead title="Files" subtitle="Versioned project files in private storage, with MIME and size checks and short-lived signed URLs."/>
    <KpiRow items={[
      {label:'Files visible',value:String(s.counts.files)},
      {label:'Client-visible',value:String(s.files.filter(f=>/client/i.test(f.visibility)).length)},
      {label:'Internal',value:String(s.files.filter(f=>/internal/i.test(f.visibility)).length)},
      {label:'Deliverables',value:String(s.counts.deliverables)},
    ]}/>
    <Panel title="Project files" flush><SimpleTable columns={['File','Project','Uploaded','Visibility']} rows={rows}
      empty={{title:'No files uploaded yet',body:'Files uploaded to private Supabase Storage appear here with their metadata, project and visibility. No sample files or invented storage totals are shown.'}}/></Panel>
    <div className="notice notice-teal" style={{marginTop:4}}><span><strong>Large files go direct to Storage.</strong> Videos and large assets use authorised/resumable uploads straight to private buckets — they are never routed through a Netlify Function body. MIME type and size are validated, and paths are scoped to the owning project.</span></div>
  </>;
}
