import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge, EmptyState } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function PortalReports(){
  const s = await getSnapshot();
  return <>
    <AppHead title="Reports" subtitle="Published client reports. Draft and internal-only reports are never visible here."/>
    <KpiRow items={[{label:'Published reports',value:String(s.counts.reports)},
      {label:'Projects',value:String(s.counts.projects)},
      {label:'Observed results',value:String(s.counts.results)},
      {label:'Campaigns',value:String(s.counts.campaigns)}]}/>
    <Panel title="Your reports">
      {s.reports.length ? s.reports.map(r=><div className="file-row" key={r.id}><span className="file-ico">RP</span><span style={{flex:1}}><strong style={{fontSize:'.86rem'}}>{r.title}</strong><span className="small faint" style={{display:'block'}}>{r.date} · {r.project} · {r.version}</span></span><Badge tone={r.tone}>{r.status}</Badge></div>)
        : <EmptyState icon="▦" title="No published reports yet"
            body="Finalised reports appear here after internal review. We do not publish placeholder reports, fabricated dashboards or invented performance numbers."/>}
    </Panel>
    <div className="notice notice-teal" style={{marginTop:4}}><span><strong>Reporting standard.</strong> Completed work, campaign activity, observed results and external-platform outcomes are reported separately, with their sources and date ranges.</span></div>
  </>;
}
