import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function AdminContent(){
  const s = await getSnapshot();
  return <>
    <AppHead title="Website content" subtitle="What is published, what is still empty, and the standards every published item must meet."/>
    <KpiRow items={[
      {label:'Published services',value:String(s.services.length)},
      {label:'Published reports',value:String(s.counts.reports)},
      {label:'Observed results',value:String(s.counts.results)},
      {label:'Legal pages',value:'3'},
    ]}/>
    <div className="split">
      <Panel title="Live content">
        {s.services.length ? s.services.map(x=><div className="metric-row" key={x.slug}><span><strong style={{fontSize:'.86rem'}}>{x.name}</strong><span className="sub">{x.category}</span></span><Link href={`/services/${x.slug}`} className="btn btn-ghost btn-sm">View ↗</Link></div>)
          : <p className="small faint" style={{margin:0}}>No published services visible to this session.</p>}
        <div className="metric-row" style={{marginTop:14}}><span>Case studies</span><Badge tone="neutral">Only with written permission</Badge></div>
        <div className="metric-row"><span>Testimonials</span><Badge tone="neutral">Only genuine &amp; permissioned</Badge></div>
      </Panel>
      <Panel title="Publishing standards">
        {['Only genuine, permissioned case studies and testimonials','No fabricated results, client logos or sales figures','Campaign results labelled with source, date range and methodology','No promises of guaranteed sales, rankings or visibility','SEO metadata and structured data editable per page','Legal pages require explicit legal sign-off before publish'].map(x=>(
          <div className="metric-row" key={x}><span style={{fontSize:'.83rem'}}>✓ {x}</span></div>
        ))}
      </Panel>
    </div>
    <div className="notice notice-teal" style={{marginTop:4}}><span><strong>Empty is honest.</strong> When there is no approved case study, article or report, the public site shows an empty state instead of invented content. Publish new material only after the client permission and source are recorded.</span></div>
  </>;
}
