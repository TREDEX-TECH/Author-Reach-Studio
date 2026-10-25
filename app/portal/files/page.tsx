import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function PortalFiles(){
  const s = await getSnapshot();
  const clientFiles = s.files.filter(f => /client/i.test(f.visibility));
  const clientDeliverables = s.deliverables.filter(d => /client/i.test(d.visibility));
  const rows = clientDeliverables.map(d=>[
    <span><strong>{d.title}</strong><span className="sub">{d.version} · {d.date}</span></span>,
    d.project, d.version, d.date,
    <Badge tone={d.tone}>{d.status}</Badge>,
  ]);
  return <>
    <AppHead title="Files & approvals" subtitle="Review approved deliverables and request changes. Files stay in private storage and are served through short-lived signed URLs."/>
    <KpiRow items={[
      {label:'Files available',value:String(clientFiles.length)},
      {label:'Deliverables',value:String(s.counts.deliverables)},
      {label:'Awaiting decision',value:String(clientDeliverables.filter(d=>/review|pending/i.test(d.status)).length)},
      {label:'Approved',value:String(clientDeliverables.filter(d=>/approved|accepted/i.test(d.status)).length)},
    ]}/>
    <div className="split">
      <Panel title="Your deliverables" flush><SimpleTable columns={['Deliverable','Project','Version','Updated','Status']} rows={rows}
        empty={{title:'No deliverables shared yet',body:'When your team marks a deliverable as client-visible, it appears here. Internal drafts, staff-only notes and other clients’ files are never accessible from this page.'}}/></Panel>
      <div>
        <Panel title="Available files">
          {clientFiles.length ? clientFiles.map(f=><div className="file-row" key={f.id}><span className="file-ico">{f.ext}</span><span style={{flex:1}}><strong style={{fontSize:'.86rem'}}>{f.name}</strong><span className="small faint" style={{display:'block'}}>{f.project} · {f.size} · {f.date}</span></span></div>)
            : <p className="small faint" style={{margin:0}}>No client-visible files have been published yet. Private drafts and internal assets are not listed here.</p>}
        </Panel>
        <Panel title="How approval works">
          <div className="revision-list" style={{marginTop:4}}>
            <div className="rev"><div className="rev-h">1. Your team uploads a new version</div><div className="rev-p">Files are checked for type and size before upload. Versions are never silently overwritten.</div></div>
            <div className="rev"><div className="rev-h">2. Internal review (when required)</div><div className="rev-p">Uploading a file does not complete a task requiring review. An authorised reviewer must approve it.</div></div>
            <div className="rev"><div className="rev-h">3. You review and decide</div><div className="rev-p">Approve a version or request a revision. Decisions are recorded with a timestamp and user ID.</div></div>
          </div>
        </Panel>
      </div>
    </div>
  </>;
}
