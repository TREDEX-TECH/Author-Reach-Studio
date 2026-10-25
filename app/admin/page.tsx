import Link from 'next/link';
import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge, Progress, HeroBanner, QuickActions } from '@/components/ui';
import { inquiries, money } from '@/lib/demo-data';
export default function AdminHome(){
  return <>
    <HeroBanner title="Business overview · October 2026" ring={78}
      text="23 new inquiries this month, 11 active projects and $3,850 in verified payments. Two projects need attention today."
      action={<><Link href="/admin/finance" className="btn btn-sm">New invoice →</Link><Link href="/admin/crm" className="btn btn-sm" style={{background:'transparent',borderColor:'rgba(255,255,255,.6)',color:'#fff'}}>Open CRM</Link></>} />
    <KpiRow items={[
      {label:'New inquiries (30d)',value:'23',delta:'+18% vs prior period',icon:'▨'},
      {label:'Inquiry → client',value:'34%',delta:'+4 pts',icon:'◍',iconTone:'blue'},
      {label:'Active projects',value:'11',delta:'2 at risk',negative:true,icon:'▣',iconTone:'violet'},
      {label:'Verified revenue (MTD)',value:money(3850),delta:'From 3 verified payments',icon:'◈',iconTone:'green'},
    ]}/>
    <QuickActions items={[
      {href:'/admin/crm',icon:'▨',label:'Inquiries',sub:'1 unassigned'},
      {href:'/admin/finance',icon:'◈',label:'Finance',sub:'2 overdue'},
      {href:'/admin/projects',icon:'▣',label:'Projects',sub:'6 in review'},
      {href:'/admin/reports',icon:'▥',label:'Reports',sub:'Verified data'},
    ]}/>
    <div className="split">
      <div>
        <Panel title="Pipeline" action={<Link href="/admin/crm" className="btn btn-ghost btn-sm">Manage →</Link>} flush>
          <SimpleTable columns={['Inquiry','Interest','Stage','Source','Date','Owner']} rows={inquiries.map(i=>[
            <span><strong>{i.name}</strong><span className="sub">{i.id}</span></span>, i.interest,
            <Badge tone={i.stage==='New inquiry'?'info':i.stage==='Active client'?'ok':i.stage==='Qualified'?'teal':'warn'}>{i.stage}</Badge>,
            i.source, i.date, i.owner,
          ])}/>
        </Panel>
        <Panel title="Delivery health">
          {[['The Salt Road — launch',68,'ok'],['Author platform refresh',91,'warn'],['Ash & Ink metadata',100,''],['Reader engagement pilot',32,'danger']].map(([n,v,t])=>(
            <div key={String(n)} style={{marginBottom:16}}><div className="spread" style={{marginBottom:7}}><span style={{fontSize:'.85rem',fontWeight:600}}>{n}</span><span className="small faint">{v}%</span></div><Progress value={Number(v)} tone={t==='warn'?'warn':t==='danger'?'danger':'ok'}/></div>
          ))}
          <div className="notice" style={{fontSize:'.8rem',marginTop:18}}><strong>Reports use verified data.</strong> Financial figures come from invoices and verified payment transactions — never from frontend checkout messages.</div>
        </Panel>
      </div>
      <div>
        <Panel title="Needs attention">
          <div className="metric-row"><span>Inquiries unassigned</span><Badge tone="danger">1</Badge></div>
          <div className="metric-row"><span>Tasks awaiting review</span><Badge tone="warn">6</Badge></div>
          <div className="metric-row"><span>Overdue invoices</span><Badge tone="danger">2</Badge></div>
          <div className="metric-row"><span>Projects at risk</span><Badge tone="warn">2</Badge></div>
          <div className="metric-row"><span>Unverified payment events</span><Badge tone="ok">0</Badge></div>
        </Panel>
        <Panel title="Verified payments (last 30 days)">
          {[['02 Sep 2026','ARS-2026-0038',850],['14 Aug 2026','ARS-2026-0031',700],['30 Jul 2026','ARS-2026-0028',2300]].map(([d,n,a])=>(
            <div className="metric-row" key={n}><span><strong style={{fontSize:'.83rem'}}>{n}</strong><span className="sub">{d} · Paystack verified</span></span><strong className="money">{money(Number(a))}</strong></div>
          ))}
          <Link href="/admin/finance" className="btn btn-outline btn-sm" style={{width:'100%',marginTop:16}}>Open finance →</Link>
        </Panel>
        <Panel title="Staff workload">
          {[['Creative Design & Video',14],['Research & Discoverability',9],['Marketing & Publicity',11],['Project Management',7]].map(([d,n])=>(
            <div className="metric-row" key={String(d)}><span>{d}</span><strong>{n} open tasks</strong></div>
          ))}
        </Panel>
      </div>
    </div>
  </>;
}
