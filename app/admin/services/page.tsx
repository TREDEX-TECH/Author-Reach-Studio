import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function AdminServices(){
  const s = await getSnapshot();
  const rows = s.services.map(x=>[
    <span><strong>{x.name}</strong><span className="sub">/{x.slug}</span></span>,
    x.category, x.pricing, x.duration, x.eligibility,
    <Badge tone="ok">Published</Badge>,
    <Link href={`/services/${x.slug}`} className="btn btn-outline btn-sm">View ↗</Link>,
  ]);
  return <>
    <AppHead title="Service catalogue" subtitle="Add, edit, hide or discontinue services without changing application code."/>
    <KpiRow items={[
      {label:'Published services',value:String(s.services.length)},
      {label:'Packages',value:String(s.counts.packages)},
      {label:'Categories',value:String(new Set(s.services.map(x=>x.category)).size)},
      {label:'Proposals',value:String(s.counts.proposals)},
    ]}/>
    <Panel title="Published services" flush><SimpleTable columns={['Service','Category','Pricing','Duration','Eligibility','Status','']} rows={rows}
      empty={{title:'No published services',body:'Publish services in the Supabase catalogue and they appear here and on the public website. Nothing is displayed until real catalogue records exist.'}}/></Panel>
    <div className="split">
      <Panel title="Catalogue rules">
        <div className="metric-row"><span>Visibility states</span><strong>Published · Hidden · Discontinued</strong></div>
        <div className="metric-row"><span>Pricing modes</span><strong>Fixed · From price · Custom proposal</strong></div>
        <div className="metric-row"><span>Proposal snapshots</span><strong>Immutable scope &amp; price</strong></div>
        <div className="metric-row"><span>Service edits</span><strong>Never alter accepted proposals</strong></div>
      </Panel>
      <Panel title="Administrative access"><p className="small muted">Editing the catalogue requires a signed-in administrator. This read-only view cannot change prices or availability, because those changes must be authorised and audited.</p></Panel>
    </div>
  </>;
}
