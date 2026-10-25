import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
export default async function AdminCrm(){
  const s = await getSnapshot();
  const rows = s.inquiries.map(i=>[
    <span className="small faint">{i.id}</span>,
    <span><strong>{i.name}</strong><span className="sub">{i.email}</span></span>,
    i.interest, <Badge tone={i.tone}>{i.stage}</Badge>, i.source, i.date, i.owner,
  ]);
  return <>
    <AppHead title="Inquiries & CRM" subtitle="Every public form submission lands here with its source, then moves through a configurable pipeline."
      action={<Link href="/contact" className="btn btn-outline btn-sm">Open public form ↗</Link>}/>
    <KpiRow items={[
      {label:'Enquiries on file',value:String(s.counts.inquiries)},
      {label:'New / open',value:String(s.inquiries.filter(i=>/new|open|contact/i.test(i.stage)).length)},
      {label:'Qualified',value:String(s.inquiries.filter(i=>/qualif/i.test(i.stage)).length)},
      {label:'Clients created',value:String(s.counts.authors)},
    ]}/>
    <Panel title="Enquiry pipeline" flush><SimpleTable columns={['Reference','Contact','Interest','Stage','Source','Received','Owner']} rows={rows}
      empty={{title:'No enquiries yet',body:'Valid enquiries from the public website appear here with their reference, source, consent and spam score. Test and honeypot submissions are filtered out before they reach this table.'}}/></Panel>
    <div className="split">
      <Panel title="Configured pipeline stages">
        {s.stages.length ? <div className="row" style={{gap:6}}>{s.stages.map(x=><Badge key={x.id} tone={x.is_active?'info':'neutral'}>{x.label}</Badge>)}</div>
          : <p className="small faint" style={{margin:0}}>No pipeline stages are visible to this session. Stages are managed in the database by an administrator.</p>}
        <p className="small muted" style={{marginTop:16,marginBottom:0}}>Stages are stored in <code>crm_pipeline_stages</code> and can be added, renamed, reordered, or marked won/lost without a code change.</p>
      </Panel>
      <Panel title="Inquiry → client workflow">
        <ul className="timeline">
          <li><div className="t">Visitor submits a form</div><div className="d">Validated, spam-checked, source recorded.</div></li>
          <li><div className="t">Team reviews and qualifies</div><div className="d">Client record, interaction history, internal notes.</div></li>
          <li><div className="t">Proposal prepared and sent</div><div className="d">Versioned scope, price, currency, terms.</div></li>
          <li><div className="t">Accepted → client + project</div><div className="d">Engagement, milestones and assignments created.</div></li>
        </ul>
      </Panel>
    </div>
  </>;
}
