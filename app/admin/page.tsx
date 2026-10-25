import Link from 'next/link';
import { KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, HeroBanner, QuickActions } from '@/components/ui';
import { EmptyRecords } from '@/components/empty-records';
import { getSnapshot } from '@/lib/data/live';
import { money } from '@/lib/format';
export default async function AdminHome(){
  const s = await getSnapshot();
  const atRisk = s.projects.filter(p=>/block|pause/i.test(p.status));
  return <>
    <HeroBanner title="Business overview" ring={s.counts.projects ? Math.round(s.projects.reduce((a,p)=>a+p.progress,0)/s.counts.projects) : 0}
      text={s.counts.inquiries || s.counts.projects
        ? `${s.counts.inquiries} enquiries · ${s.counts.activeProjects} active projects · ${money(s.counts.verifiedRevenue)} in verified payments.`
        : 'Every figure on this page comes from live records. Nothing is shown until real data exists.'}
      action={<><Link href="/admin/crm" className="btn btn-sm">Open CRM →</Link><Link href="/admin/finance" className="btn btn-sm" style={{background:'transparent',borderColor:'rgba(255,255,255,.6)',color:'#fff'}}>Finance</Link></>} />
    <KpiRow items={[
      {label:'Enquiries',value:String(s.counts.inquiries)},
      {label:'Active projects',value:String(s.counts.activeProjects)},
      {label:'Verified revenue',value:money(s.counts.verifiedRevenue)},
      {label:'Published services',value:String(s.services.length)},
    ]}/>
    <QuickActions items={[
      {href:'/admin/crm',icon:'▨',label:'Inquiries',sub:`${s.counts.inquiries} received`},
      {href:'/admin/finance',icon:'◈',label:'Finance',sub:`${s.counts.invoices} invoices`},
      {href:'/admin/projects',icon:'▣',label:'Projects',sub:`${s.counts.projects} total`},
      {href:'/admin/reports',icon:'▥',label:'Reports',sub:'Verified data'},
    ]}/>
    <div className="split">
      <div>
        <Panel title="Recent enquiries" action={<Link href="/admin/crm" className="btn btn-ghost btn-sm">Manage →</Link>} flush>
          <SimpleTable columns={['Reference','Contact','Interest','Stage','Source','Received']}
            rows={s.inquiries.slice(0,8).map(i=>[<span className="small faint">{i.id}</span>,
              <span><strong>{i.name}</strong><span className="sub">{i.email}</span></span>,i.interest,
              <Badge tone={i.tone}>{i.stage}</Badge>,i.source,i.date])}
            empty={{title:'No enquiries yet',body:'Public form submissions land here with their source, consent and spam score as soon as they arrive.'}}/>
        </Panel>
      </div>
      <div>
        <Panel title="Needs attention">
          <div className="metric-row"><span>Projects blocked / paused</span><Badge tone={atRisk.length?'danger':'ok'}>{atRisk.length}</Badge></div>
          <div className="metric-row"><span>Deliverables in review</span><Badge tone="warn">{s.deliverables.filter(d=>/review|pending/i.test(d.status)).length}</Badge></div>
          <div className="metric-row"><span>Unverified payments</span><Badge tone="ok">{s.payments.filter(p=>!p.verified).length}</Badge></div>
          <div className="metric-row"><span>Audit events recorded</span><strong>{s.counts.audit}</strong></div>
        </Panel>
        <Panel title="Verified payments">
          {s.payments.filter(p=>p.verified).length
            ? s.payments.filter(p=>p.verified).slice(0,5).map(p=><div className="metric-row" key={p.id}><span><strong style={{fontSize:'.83rem'}}>{p.reference}</strong><span className="sub">{p.date}</span></span><strong className="money">{money(p.amount,p.currency)}</strong></div>)
            : <EmptyRecords noun="verified payments" />}
          <Link href="/admin/finance" className="btn btn-outline btn-sm" style={{width:'100%',marginTop:16}}>Open finance →</Link>
        </Panel>
      </div>
    </div>
  </>;
}
