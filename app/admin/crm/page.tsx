import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { inquiries } from '@/lib/demo-data';
export default function AdminCrm(){
  return <>
    <AppHead title="Inquiries & CRM" subtitle="Every public form submission lands here with its source, then moves through a configurable pipeline."
      action={<Link href="/admin/crm" className="btn btn-primary btn-sm">+ Add inquiry</Link>}/>
    <KpiRow items={[{label:'New this month',value:'23'},{label:'Qualified',value:'9'},{label:'Proposals sent',value:'6'},{label:'Conversion rate',value:'34%'}]}/>
    <Panel title="Pipeline" flush>
      <SimpleTable columns={['Reference','Name','Interest','Stage','Source','Received','Owner']} rows={inquiries.map(i=>[
        <span className="small faint">{i.id}</span>, <strong>{i.name}</strong>, i.interest,
        <Badge tone={i.stage==='New inquiry'?'info':i.stage==='Active client'?'ok':i.stage==='Qualified'?'teal':'warn'}>{i.stage}</Badge>,
        i.source, i.date, i.owner,
      ])}/>
    </Panel>
    <div className="split">
      <Panel title="Configurable stages">
        <div className="row" style={{gap:6}}>
          {['New inquiry','Contacted','Qualified','Proposal sent','Accepted','Active client','Completed','Inactive','Lost'].map(s=><span key={s} className="badge badge-neutral" style={{fontSize:'.69rem'}}>{s}</span>)}
        </div>
        <p className="small muted" style={{marginTop:16,marginBottom:0}}>Stages are stored in <code>crm_pipeline_stages</code> and can be added, renamed, reordered, or marked won/lost from the admin UI — no code change required.</p>
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
