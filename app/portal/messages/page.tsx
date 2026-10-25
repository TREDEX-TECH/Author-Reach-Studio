import Link from 'next/link';
import { AppHead } from '@/components/module-view';
import { Panel, EmptyState } from '@/components/ui';
export default function PortalMessages(){
  return <>
    <AppHead title="Messages" subtitle="Project-scoped conversations with the team working on your engagement."/>
    <div className="split">
      <Panel title="The Salt Road — launch" flush>
        <div style={{padding:20}}>
          <div className="msg"><span className="avatar" style={{width:30,height:30,fontSize:'.7rem'}}>TA</span><div className="body"><div className="meta">Tola Adebayo · Project Manager · 24 Oct, 09:14</div>Hi Amara — the launch creative pack is ready for your review in Files &amp; deliverables. Could you approve it or send revision notes by Tuesday so we stay on schedule?</div></div>
          <div className="msg mine"><span className="avatar" style={{width:30,height:30,fontSize:'.7rem'}}>AN</span><div className="body"><div className="meta">You · 24 Oct, 10:02</div>Thanks Tola. I’ll look at it tonight. One question: can we get the square versions for Instagram as well?</div></div>
          <div className="msg"><span className="avatar" style={{width:30,height:30,fontSize:'.7rem'}}>AB</span><div className="body"><div className="meta">Aisha Bello · Creative Design · 24 Oct, 10:41</div>Yes — I’ve added 1:1 exports to version 3. They’re in the same zip file.</div></div>
          <div className="row" style={{marginTop:20}}><input placeholder="Write a message…" aria-label="Message"/><Link href="/portal/messages" className="btn btn-primary btn-sm">Send</Link></div>
        </div>
      </Panel>
      <div>
        <Panel title="Conversations">
          {[['The Salt Road — launch','3 messages','Active'],['Author platform refresh','1 message','Active']].map(([t,s,st])=>(
            <div className="file-row" key={t}><span className="file-ico">◉</span><span style={{flex:1}}><strong style={{fontSize:'.85rem'}}>{t}</strong><span className="small faint" style={{display:'block'}}>{s} · {st}</span></span></div>
          ))}
        </Panel>
        <Panel title="Privacy"><p className="small muted" style={{margin:0}}>These conversations are scoped to your projects. Internal staff notes and other clients’ conversations are never visible to you. A signed-in client cannot read another client’s messages by changing an ID.</p></Panel>
      </div>
    </div>
  </>;
}
