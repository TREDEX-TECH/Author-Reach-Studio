import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Progress, Badge, HeroBanner, QuickActions } from '@/components/ui';
import { projects, invoices, money } from '@/lib/demo-data';

export default function PortalHome() {
  const active = projects.filter(p => p.status !== 'Completed');
  return (
    <>
      <HeroBanner title="Good morning, Amara 👋" ring={68}
        text="You have 2 active projects, 1 deliverable waiting for your review and 1 invoice due soon. Here's everything in one place."
        action={<><Link href="/portal/files" className="btn btn-sm">Review deliverable →</Link><Link href="/portal/messages" className="btn btn-sm" style={{background:'transparent',borderColor:'rgba(255,255,255,.6)',color:'#fff'}}>Message team</Link></>} />

      <KpiRow items={[
        {label:'Active projects',value:'2',delta:'1 milestone due this week',icon:'◧'},
        {label:'Pending approvals',value:'1',delta:'Action needed',negative:true,icon:'✓',iconTone:'red'},
        {label:'Outstanding balance',value:money(1450),delta:'Due 26 Oct 2026',negative:true,icon:'◈',iconTone:'violet'},
        {label:'Files available',value:'18',delta:'3 added this month',icon:'▧',iconTone:'green'},
      ]}/>

      <QuickActions items={[
        {href:'/portal/projects',icon:'▣',label:'My projects',sub:'2 active'},
        {href:'/portal/proposals',icon:'▦',label:'Proposals',sub:'1 awaiting decision'},
        {href:'/portal/invoices',icon:'◈',label:'Pay an invoice',sub:'1 outstanding'},
        {href:'/portal/files',icon:'▧',label:'Files & approvals',sub:'1 to review'},
      ]}/>

      <div className="split">
        <div>
          <Panel title="Your projects" action={<Link href="/portal/projects" className="btn btn-ghost btn-sm">View all →</Link>} flush>
            <div style={{padding:'20px 20px 4px'}}>
              {active.map(p => (
                <div key={p.id} style={{paddingBottom:18,marginBottom:18,borderBottom:'1px solid var(--line-soft)'}}>
                  <div className="spread" style={{marginBottom:10}}>
                    <div><strong style={{fontSize:'.92rem'}}>{p.name}</strong><div className="small faint">{p.id} · Manager: {p.manager} · Due {p.due}</div></div>
                    <Badge tone={p.tone}>{p.status}</Badge>
                  </div>
                  <Progress value={p.progress} tone={p.tone==='warn'?'warn':''}/>
                  <div className="spread small faint" style={{marginTop:7}}><span>{p.progress}% of milestones complete</span>
                    <Link href="/portal/projects" style={{color:'var(--brand-dark)',fontWeight:700}}>Open →</Link></div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Recent activity" flush>
            <ul className="timeline" style={{padding:'20px 20px 8px'}}>
              <li><div className="t">Launch creative pack submitted for your review</div><div className="d">24 Oct 2026 · The Salt Road launch</div></li>
              <li><div className="t">Milestone “Metadata and page audit” approved</div><div className="d">18 Oct 2026 · The Salt Road launch</div></li>
              <li><div className="t">Invoice {invoices[0].number} issued</div><div className="d">12 Oct 2026 · {money(invoices[0].amount)}</div></li>
              <li className="dim"><div className="t">Proposal PROP-2026-0088 accepted</div><div className="d">04 Oct 2026 · Version v2 recorded</div></li>
            </ul>
          </Panel>
        </div>
        <div>
          <div className="callout" style={{marginBottom:20}}>
            <span className="co-ico">✳</span>
            <div><h4>1 item needs your decision</h4><p>“Launch creative pack” is waiting for your approval or revision request. Your project is on hold at this milestone until you respond.</p>
            <Link href="/portal/files" className="btn btn-primary btn-sm" style={{marginTop:12}}>Review deliverable →</Link></div>
          </div>
          <Panel title="Invoices">
            <div className="metric-row"><span>Outstanding</span><strong className="money">{money(1450)}</strong></div>
            <div className="metric-row"><span>Due date</span><strong>26 Oct 2026</strong></div>
            <div className="metric-row"><span>Paid in 2026</span><strong className="money">{money(1550)}</strong></div>
            <Link href="/portal/invoices" className="btn btn-outline btn-sm" style={{width:'100%',marginTop:18}}>View invoices &amp; pay →</Link>
          </Panel>
          <Panel title="Your books">
            {[['The Salt Road','Published · 2026'],['Ash & Ink','Pre-publication'],['Notes to a Young Writer','Published · 2023']].map(([t,s])=>(
              <div className="file-row" key={t}><span className="file-ico">BK</span><span style={{flex:1}}><strong style={{fontSize:'.86rem'}}>{t}</strong><span className="small faint" style={{display:'block'}}>{s}</span></span></div>
            ))}
            <Link href="/portal/books" className="btn btn-ghost btn-sm" style={{marginTop:12}}>Manage books →</Link>
          </Panel>
        </div>
      </div>
      <div className="notice notice-teal" style={{marginTop:4}}>
        <span><strong>Only your information.</strong> This portal shows your own books, projects, proposals, invoices and approved deliverables. Internal staff notes, other clients’ records and internal cost data are never visible here.</span>
      </div>
    </>
  );
}
