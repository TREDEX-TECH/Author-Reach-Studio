import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
import { money } from '@/lib/format';
export default async function PortalProposals(){
  const s = await getSnapshot();
  const total = s.proposals.reduce((a,p)=>a+p.amount,0);
  const rows = s.proposals.map(p=>[
    <span><strong>{p.id}</strong><span className="sub">{p.title}</span></span>,
    p.version, p.date, p.valid, <span className="money">{money(p.amount,p.currency)}</span>,
    <Badge tone={p.tone}>{p.status}</Badge>,
  ]);
  return <>
    <AppHead title="Proposals" subtitle="Every proposal version is preserved. Accepting an online proposal records the exact terms you agreed to."/>
    <KpiRow items={[{label:'Proposals',value:String(s.counts.proposals)},
      {label:'Awaiting decision',value:String(s.proposals.filter(p=>/sent|viewed|await/i.test(p.status)).length)},
      {label:'Accepted',value:String(s.proposals.filter(p=>/accept/i.test(p.status)).length)},
      {label:'Total proposed',value:money(total)}]}/>
    <Panel title="All proposals" flush><SimpleTable columns={['Reference','Version','Sent','Valid until','Value','Status']} rows={rows}
      empty={{title:'No proposals yet',body:'After we scope your project, a written proposal with deliverables, price, currency and terms appears here. Accepted versions are kept as an immutable snapshot.'}}/></Panel>
    <div className="split">
      <Panel title="How acceptance works"><p className="small muted">A proposal lists scope, deliverables, timeline, price, currency and terms. When you accept, the exact version is stored with a content hash, your user ID and a timestamp. Later catalogue changes never alter what you agreed to.</p>
        <Link href="/contact" className="btn btn-outline btn-sm" style={{marginTop:14}}>Request a proposal →</Link></Panel>
      <Panel title="What acceptance records">
        {['Proposal ID and version number','A hash of the accepted scope and terms','Your user ID and timestamp','IP address and user agent','Any electronic signature reference'].map(x=><div className="metric-row" key={x}><span>✓ {x}</span></div>)}
      </Panel>
    </div>
  </>;
}
