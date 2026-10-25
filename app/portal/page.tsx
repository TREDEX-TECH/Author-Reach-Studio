import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Progress, Badge, HeroBanner, QuickActions } from '@/components/ui';
import { EmptyRecords } from '@/components/empty-records';
import { getSnapshot } from '@/lib/data/live';
import { money } from '@/lib/format';

export default async function PortalHome() {
  const s = await getSnapshot();
  const active = s.projects.filter(p => !/completed|cancel/i.test(p.status));
  const clientDeliverables = s.deliverables.filter(d => /client/i.test(d.visibility));
  const pending = clientDeliverables.filter(d => /review|pending/i.test(d.status));
  return <>
    <HeroBanner title="Your author workspace" ring={s.projects.length ? Math.round(s.projects.reduce((a,p)=>a+p.progress,0)/s.projects.length) : 0}
      text={s.counts.projects
        ? `${s.counts.activeProjects} active projects · ${pending.length} deliverables awaiting review · ${s.invoices.filter(i=>!/paid|refund/i.test(i.status)).length} invoices outstanding.`
        : 'Track projects, proposals, deliverables and invoices here. Nothing appears until real records exist.'}
      action={<><Link href="/portal/files" className="btn btn-sm">View deliverables →</Link><Link href="/portal/messages" className="btn btn-sm" style={{background:'transparent',borderColor:'rgba(255,255,255,.6)',color:'#fff'}}>Message team</Link></>} />
    <KpiRow items={[
      {label:'Active projects',value:String(s.counts.activeProjects)},
      {label:'Pending approvals',value:String(pending.length)},
      {label:'Outstanding balance',value:money(s.counts.outstanding)},
      {label:'Files available',value:String(s.counts.files)},
    ]}/>
    <QuickActions items={[
      {href:'/portal/projects',icon:'▣',label:'My projects',sub:`${s.counts.projects} total`},
      {href:'/portal/proposals',icon:'▦',label:'Proposals',sub:`${s.counts.proposals} on file`},
      {href:'/portal/invoices',icon:'◈',label:'Invoices',sub:`${s.counts.invoices} issued`},
      {href:'/portal/files',icon:'▧',label:'Files & approvals',sub:`${s.counts.files} available`},
    ]}/>
    <div className="split">
      <div>
        <Panel title="Your projects" action={<Link href="/portal/projects" className="btn btn-ghost btn-sm">View all →</Link>} flush>
          {active.length ? <div style={{padding:'20px 20px 4px'}}>{active.map(p=>(
            <div key={p.id} style={{paddingBottom:18,marginBottom:18,borderBottom:'1px solid var(--line-soft)'}}>
              <div className="spread" style={{marginBottom:10}}><div><strong style={{fontSize:'.92rem'}}>{p.name}</strong><div className="small faint">{p.ref} · Due {p.due}</div></div><Badge tone={p.tone}>{p.status}</Badge></div>
              <Progress value={p.progress} tone={p.tone==='warn'?'warn':''}/>
              <div className="spread small faint" style={{marginTop:7}}><span>{p.progress}% of milestones complete</span><Link href="/portal/projects" style={{color:'var(--brand-dark)',fontWeight:700}}>Open →</Link></div>
            </div>))}</div>
          : <EmptyRecords noun="projects" href="/contact" action="Start a project →" />}
        </Panel>
      </div>
      <div>
        <Panel title="Invoices">
          <div className="metric-row"><span>Outstanding</span><strong className="money">{money(s.counts.outstanding)}</strong></div>
          <div className="metric-row"><span>Invoices issued</span><strong>{s.counts.invoices}</strong></div>
          <div className="metric-row"><span>Verified payments</span><strong>{s.payments.filter(p=>p.verified).length}</strong></div>
          <Link href="/portal/invoices" className="btn btn-outline btn-sm" style={{width:'100%',marginTop:18}}>View invoices →</Link>
        </Panel>
        <Panel title="Your books">
          {s.books.length ? s.books.map(b=><div className="file-row" key={b.id}><span className="file-ico">BK</span><span style={{flex:1}}><strong style={{fontSize:'.86rem'}}>{b.title}</strong><span className="small faint" style={{display:'block'}}>{b.status}</span></span></div>)
            : <EmptyRecords noun="books" href="/portal/books/new" action="Add a book →" />}
        </Panel>
      </div>
    </div>
    <div className="notice notice-teal" style={{marginTop:4}}><span><strong>Only your information.</strong> Row-level security shows you only your own books, projects, proposals, invoices and approved deliverables. Internal staff notes, other clients’ records and internal cost data are never visible here.</span></div>
  </>;
}
