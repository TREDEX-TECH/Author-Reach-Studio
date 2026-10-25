import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, EmptyState } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function PortalResults(){
  const s = await getSnapshot();
  return <>
    <AppHead title="Campaign results" subtitle="Observed results from your campaigns, with sources and labels. We do not promise guaranteed sales, rankings or visibility."/>
    <KpiRow items={[{label:'Campaigns',value:String(s.counts.campaigns)},
      {label:'Observed results',value:String(s.counts.results)},
      {label:'Active campaigns',value:String(s.campaigns.filter(c=>/active|running/i.test(c.status)).length)},
      {label:'Published reports',value:String(s.counts.reports)}]}/>
    {s.results.length ? <Panel title="Observed results">
      <div className="table-wrap"><table className="table"><thead><tr><th>Metric</th><th>Value</th><th>Campaign</th><th>Period</th><th>Source</th></tr></thead><tbody>
        {s.results.map(r=><tr key={r.id}><td><strong>{r.metric}</strong></td><td>{r.value}</td><td>{r.campaign}</td><td>{r.period}</td><td>{r.source}</td></tr>)}
      </tbody></table></div></Panel>
      : <Panel title="Observed results"><EmptyState icon="◷" title="No campaign results yet"
          body="Results appear once there is a real campaign and a real data source. We report completed work, campaign activity and observed outcomes separately. External-platform figures are labelled with their source; we do not invent sales numbers, rankings or visibility claims."/></Panel>}
    <div className="notice" style={{marginTop:4}}><strong>What we do not claim.</strong>&nbsp; Book sales, rankings, reviews, ad performance and visibility depend on platforms and readers outside our control. We report observations; we do not promise outcomes.</div>
  </>;
}
