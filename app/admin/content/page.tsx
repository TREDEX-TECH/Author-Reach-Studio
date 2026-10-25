import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
export default function AdminContent(){
  return <>
    <AppHead title="Website content" subtitle="Manage suitable public content without editing code."/>
    <KpiRow items={[{label:'Pages',value:'11'},{label:'Services published',value:'8'},{label:'Blog drafts',value:'6'},{label:'Case studies',value:'0',delta:'Awaiting client permission',negative:true}]}/>
    <Panel title="Content items" flush>
      <SimpleTable columns={['Page / item','Type','Status','Last updated','Owner','']} rows={[
        ['Homepage','Page',<Badge tone="ok">Published</Badge>,'20 Oct 2026','Marketing','Edit'],
        ['Services index','Page',<Badge tone="ok">Published</Badge>,'18 Oct 2026','Marketing','Edit'],
        ['Service detail × 8','Catalogue',<Badge tone="ok">Published</Badge>,'18 Oct 2026','Marketing','Edit'],
        ['How it works','Page',<Badge tone="ok">Published</Badge>,'12 Oct 2026','PM','Edit'],
        ['Case studies','Portfolio',<Badge tone="warn">Empty state</Badge>,'—','Marketing','Edit'],
        ['Resources / blog','Articles',<Badge tone="neutral">6 drafts</Badge>,'10 Oct 2026','Marketing','Edit'],
        ['Privacy / Terms / Refunds','Legal',<Badge tone="danger">Draft — legal review</Badge>,'25 Oct 2026','Admin','Edit'],
        ['FAQ','Page',<Badge tone="ok">Published</Badge>,'08 Oct 2026','Client Relations','Edit'],
      ].map(r=>[<strong>{r[0]}</strong>,r[1],r[2],r[3],r[4],<a href="#" className="btn btn-outline btn-sm">{r[5]}</a>])}/>
    </Panel>
    <div className="split">
      <Panel title="Content integrity rules">
        {['Only genuine, permissioned case studies and testimonials','No fabricated results, client logos or sales figures','Campaign results labelled with source, date range and methodology','No promises of guaranteed sales, rankings or visibility','SEO metadata and structured data editable per page','Legal pages require explicit legal sign-off before publish'].map(x=>(
          <div className="metric-row" key={x}><span style={{fontSize:'.83rem'}}>✓ {x}</span></div>
        ))}
      </Panel>
      <Panel title="Blocked until you provide content"><p className="small muted">The prototype uses clearly-labelled illustrative copy. Before launch we need your real service catalogue, approved portfolio items and legally reviewed policies. See <code>docs/07-content-inventory.md</code>.</p></Panel>
    </div>
  </>;
}
