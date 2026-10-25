import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge, EmptyState } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
import { dateLabel, titleCase, toneForStatus } from '@/lib/format';
export default async function PortalNotifications(){
  const s = await getSnapshot();
  const unread = s.notifications.filter(n=>!n.read_at);
  return <>
    <AppHead title="Notifications" subtitle="Updates on deliverables, invoices and approval requests. Notification preferences are configurable."/>
    <KpiRow items={[{label:'Notifications',value:String(s.notifications.length)},
      {label:'Unread',value:String(unread.length)},
      {label:'Projects',value:String(s.counts.projects)},
      {label:'Approvals pending',value:String(s.deliverables.filter(d=>/client/i.test(d.visibility) && /review|pending/i.test(d.status)).length)}]}/>
    <Panel title="All notifications">
      {s.notifications.length ? s.notifications.map(n=><div className="notif" key={n.id}><div className="notif-dot"/><div style={{flex:1}}><strong>{n.title}</strong><p className="small faint" style={{margin:'4px 0 0'}}>{n.body || 'No further details.'}</p><span className="small faint">{dateLabel(n.created_at)}</span></div><Badge tone={toneForStatus(n.status)}>{n.read_at ? 'Read' : titleCase(n.status)}</Badge></div>)
        : <EmptyState icon="◇" title="No notifications yet" body="Approval requests, published deliverables and invoice events will appear here when they actually happen. Notification preferences are configurable per user."/>}
    </Panel>
  </>;
}
