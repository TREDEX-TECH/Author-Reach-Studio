import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge, EmptyState } from '@/components/ui';
export default function WorkspaceReviews(){
  const items = [
    { t:'Finalise A+ module copy deck', p:'The Salt Road — launch', by:'Aisha Bello', v:'v3', date:'24 Oct 2026', tone:'warn' },
    { t:'Homepage proof (desktop + mobile)', p:'Author platform refresh', by:'Tola Adebayo', v:'v2', date:'23 Oct 2026', tone:'danger' },
  ];
  return <>
    <AppHead title="Reviews" subtitle="Approve work or request changes. Every decision is recorded with its version."/>
    <KpiRow items={[{label:'Awaiting my review',value:'2'},{label:'Approved this week',value:'4'},{label:'Changes requested',value:'1'},{label:'Avg. review time',value:'1.4 days'}]}/>
    {items.map(i=>(
      <Panel key={i.t} title={i.t} action={<Badge tone={i.tone}>In review</Badge>}>
        <div className="spread" style={{marginBottom:16}}><div className="small faint">Project: {i.p} · Submitted by {i.by} · Version {i.v} · {i.date}</div></div>
        <div className="grid grid-2">
          <div><h4>Deliverable versions</h4>
            {[['v1','18 Oct 2026','Superseded'],['v2','21 Oct 2026','Superseded'],['v3','24 Oct 2026','Current']].map(([v,d,s])=>(
              <div className="file-row" key={v}><span className="file-ico">{v.toUpperCase()}</span><span style={{flex:1}}><strong style={{fontSize:'.85rem'}}>Version {v}</strong><span className="small faint" style={{display:'block'}}>{d} · {s}</span></span><Badge tone={s==='Current'?'info':'neutral'}>{s}</Badge></div>
            ))}
          </div>
          <div><h4>Your decision</h4>
            <label>Client-visible feedback</label><textarea placeholder="Feedback the client may see" style={{minHeight:80}}/>
            <label style={{marginTop:12}}>Internal feedback (team only)</label><textarea placeholder="Internal notes — never shown to the client" style={{minHeight:70}}/>
            <div className="row" style={{marginTop:14}}><Link href="/workspace/reviews" className="btn btn-primary btn-sm">Approve</Link><Link href="/workspace/reviews" className="btn btn-outline btn-sm">Request changes</Link></div>
          </div>
        </div>
      </Panel>
    ))}
  </>;
}
