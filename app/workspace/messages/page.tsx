import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { EmptyRecords } from '@/components/empty-records';
import { getSnapshot } from '@/lib/data/live';
export default async function WorkspaceMessages(){
  const s = await getSnapshot();
  const internal = s.messages.filter(m=>/internal|staff/i.test(m.visibility));
  const shared = s.messages.filter(m=>/client/i.test(m.visibility));
  return <>
    <AppHead title="Conversations" subtitle="Project-scoped conversations and internal notes — kept visibly separate by row-level security."/>
    <KpiRow items={[
      {label:'Conversations',value:String(s.conversations.length)},
      {label:'Messages visible',value:String(s.messages.length)},
      {label:'Client-visible',value:String(shared.length)},
      {label:'Internal only',value:String(internal.length)},
    ]}/>
    <div className="split">
      <Panel title="Conversations">
        {s.conversations.length ? s.conversations.map(c=><div className="file-row" key={c.id}><span className="file-ico">◇</span><span style={{flex:1}}><strong style={{fontSize:'.86rem'}}>{c.subject}</strong><span className="small faint" style={{display:'block'}}>{c.project} · {c.kind} · {c.messages} messages</span></span></div>)
          : <EmptyRecords noun="conversations" body="Real project conversations appear here. Internal notes, client-visible updates and other clients’ threads are separated by database policy."/>}
      </Panel>
      <Panel title="Message visibility">
        {s.messages.length ? s.messages.map(m=><div className="msg" key={m.id}><div className="msg-head"><strong>{m.sender}</strong><span>{m.when}</span><Badge tone={/client/i.test(m.visibility)?'info':'neutral'}>{m.visibility}</Badge></div><p>{m.body}</p></div>)
          : <p className="small faint" style={{margin:0}}>No messages yet. Internal notes are never shown in the client portal.</p>}
      </Panel>
    </div>
    <div className="notice" style={{marginTop:4}}><strong>Read-only view.</strong>&nbsp; Posting a message requires a signed-in account and server-side membership checks. This page never claims a message was sent when it was not.</div>
  </>;
}
