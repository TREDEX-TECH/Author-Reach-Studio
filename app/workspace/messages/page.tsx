import { AppHead } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
export default function WorkspaceMessages(){
  return <>
    <AppHead title="Conversations" subtitle="Project-scoped conversations and internal notes — kept visibly separate."/>
    <div className="split">
      <Panel title="The Salt Road — launch (internal)" flush>
        <div style={{padding:20}}>
          <div className="msg"><span className="avatar" style={{width:30,height:30,fontSize:'.7rem'}}>TA</span><div className="body"><div className="meta">Tola Adebayo · 24 Oct, 08:40 <Badge tone="neutral">Internal</Badge></div>Client asked for square exports. Let’s include them in v3 before we send for approval.</div></div>
          <div className="msg"><span className="avatar" style={{width:30,height:30,fontSize:'.7rem'}}>AB</span><div className="body"><div className="meta">Aisha Bello · 24 Oct, 10:35 <Badge tone="neutral">Internal</Badge></div>Added. Uploading v3 now — will not mark the task complete until you review it.</div></div>
          <div className="notice" style={{fontSize:'.8rem'}}><strong>Internal only.</strong> These notes are never shown in the client portal. Client-visible messages are a separate visibility class enforced by RLS.</div>
        </div>
      </Panel>
      <Panel title="Visibility rules">
        <div className="metric-row"><span>Internal notes</span><Badge tone="neutral">Staff only</Badge></div>
        <div className="metric-row"><span>Drafts under review</span><Badge tone="neutral">Staff only</Badge></div>
        <div className="metric-row"><span>Approved updates</span><Badge tone="ok">Client visible</Badge></div>
        <div className="metric-row"><span>Client messages</span><Badge tone="info">Conversation members</Badge></div>
      </Panel>
    </div>
  </>;
}
