import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { services } from '@/lib/demo-data';
export default function AdminServices(){
  return <>
    <AppHead title="Service catalogue" subtitle="Add, edit, hide or discontinue services without changing application code."/>
    <KpiRow items={[{label:'Published services',value:'8'},{label:'Hidden',value:'0'},{label:'Packages',value:'2'},{label:'Custom-priced',value:'5'}]}/>
    <Panel title="Services" flush>
      <SimpleTable columns={['Service','Category','Pricing','Duration','Eligibility','Status','']} rows={services.map(s=>[
        <span><strong>{s.name}</strong><span className="sub">/{s.slug}</span></span>, s.category, s.pricing, s.duration,
        <span className="small muted">{s.eligibility}</span>, <Badge tone="ok">Published</Badge>,
        <a href="#" className="btn btn-outline btn-sm">Edit</a>,
      ])}/>
    </Panel>
    <div className="split">
      <Panel title="Catalogue rules">
        <div className="metric-row"><span>Visibility states</span><strong>Published · Hidden · Discontinued</strong></div>
        <div className="metric-row"><span>Pricing modes</span><strong>Fixed · From price · Custom proposal</strong></div>
        <div className="metric-row"><span>Proposal snapshots</span><strong>Immutable scope &amp; price</strong></div>
        <div className="metric-row"><span>Service edits</span><strong>Never alter accepted proposals</strong></div>
      </Panel>
      <Panel title="Why this matters"><p className="small muted">When an administrator changes a service description or price, existing accepted proposals must not change. Each proposal stores a frozen snapshot of the scope, deliverables, prices, currency and terms at the version the client accepted.</p></Panel>
    </div>
  </>;
}
