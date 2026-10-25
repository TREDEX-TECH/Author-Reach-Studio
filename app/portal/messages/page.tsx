import Link from 'next/link';
import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { EmptyRecords } from '@/components/empty-records';
import { getSnapshot } from '@/lib/data/live';
import { SITE } from '@/lib/config';
export default async function PortalMessages(){
  const s = await getSnapshot();
  const clientMessages = s.messages.filter(m=>/client/i.test(m.visibility));
  const internalMessages = s.messages.filter(m=>/internal|staff/i.test(m.visibility));
  return <>
    <AppHead title="Messages" subtitle="Talk to your team. Internal staff discussions and private business notes are never visible to clients."/>
    <KpiRow items={[{label:'Conversations',value:String(s.conversations.length)},
      {label:'Client-visible messages',value:String(clientMessages.length)},
      {label:'Staff-only messages',value:String(internalMessages.length)},
      {label:'Support email',value:SITE.email}]}/>
    <div className="split">
      <Panel title="Your conversations">
        {s.conversations.length ? s.conversations.map(c=><div className="file-row" key={c.id}><span className="file-ico">◇</span><span style={{flex:1}}><strong style={{fontSize:'.86rem'}}>{c.subject}</strong><span className="small faint" style={{display:'block'}}>{c.project} · {c.messages} messages · {c.kind}</span></span></div>)
          : <EmptyRecords noun="conversations" body="Start a conversation with your team here. Internal-only notes and private staff discussions are never shown to clients." href="/contact" action="Contact us →" />}
      </Panel>
      <Panel title="Client-visible discussion">
        {clientMessages.length ? clientMessages.map(m=><div className="msg" key={m.id}><div className="msg-head"><strong>{m.sender}</strong><span>{m.when}</span><Badge tone="ok">Shared</Badge></div><p>{m.body}</p></div>)
          : <p className="small faint" style={{margin:0}}>No client-visible messages yet. Conversations shared with you will appear here; internal staff notes remain private.</p>}
        <div className="row" style={{marginTop:16}}><Link href="/contact" className="btn btn-outline btn-sm">Contact the team →</Link></div>
      </Panel>
    </div>
  </>;
}
