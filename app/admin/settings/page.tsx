import { AppHead, KpiRow, SimpleTable } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
import { hasSupabase, requireAuth, SITE } from '@/lib/config';
const display = (v: unknown) => typeof v === 'string' ? v : JSON.stringify(v);
export default async function AdminSettings(){
  const s = await getSnapshot();
  const settingRows = s.settings.map(x=>[
    <code style={{fontSize:'.78rem'}}>{x.key}</code>,
    <code style={{fontSize:'.78rem'}}>{display(x.value)}</code>,
    x.is_public ? <Badge tone="info">Public</Badge> : <Badge tone="neutral">Server only</Badge>,
    x.description || '—',
  ]);
  const integrations: [string,string,string][] = [
    ['Supabase database', hasSupabase() ? 'Configured' : 'Not configured', hasSupabase()?'ok':'warn'],
    ['Paystack secret', process.env.PAYSTACK_SECRET_KEY ? 'Configured on server' : 'Not configured', process.env.PAYSTACK_SECRET_KEY?'ok':'warn'],
    ['Email provider key', process.env.EMAIL_API_KEY ? 'Configured on server' : 'Not configured', process.env.EMAIL_API_KEY?'ok':'warn'],
    ['Site URL', SITE.url, 'info'],
    ['Private dashboard sign-in', requireAuth() ? 'Required' : 'Optional (read-only)', requireAuth()?'ok':'warn'],
  ];
  return <>
    <AppHead title="Settings & roles" subtitle="Configurable business rules, roles, permissions and integration status."/>
    <KpiRow items={[
      {label:'Roles',value:String(s.counts.roles)},
      {label:'Permissions',value:String(s.counts.permissions)},
      {label:'Config keys',value:String(s.counts.settings)},
      {label:'Departments',value:String(s.counts.departments)},
    ]}/>
    <div className="split">
      <div>
        <Panel title="Application settings" flush>
          <SimpleTable columns={['Key','Value','Visibility','Description']} rows={settingRows}
            empty={{title:'No settings visible',body:'Server-only settings are hidden unless your signed-in role is permitted to read them. Never paste secret keys into database settings.'}}/>
        </Panel>
        <Panel title="Integration status">
          {integrations.map(([n,status,tone])=>(
            <div className="metric-row" key={n}><span><strong style={{fontSize:'.85rem'}}>{n}</strong></span><Badge tone={tone}>{status}</Badge></div>
          ))}
          <div className="notice" style={{marginTop:16,fontSize:'.8rem'}}><strong>Never paste secrets here.</strong> Secret keys belong in Netlify’s environment UI and Supabase’s dashboard. They are never stored in ordinary database records or committed to the repository.</div>
        </Panel>
      </div>
      <div>
        <Panel title="Roles">
          {s.roles.length ? s.roles.map(r=><div className="metric-row" key={r.id}><span><code style={{fontSize:'.78rem'}}>{r.slug}</code><span className="sub">{r.name}</span></span></div>)
            : <p className="small faint" style={{margin:0}}>No roles visible to this session.</p>}
        </Panel>
        <Panel title="Security posture">
          <div className="metric-row"><span>RLS on all tables</span><Badge tone="ok">Enabled</Badge></div>
          <div className="metric-row"><span>Service-role key in browser</span><Badge tone="ok">Never</Badge></div>
          <div className="metric-row"><span>Payment writes from client</span><Badge tone="ok">Blocked</Badge></div>
          <div className="metric-row"><span>User self role-grant</span><Badge tone="ok">Blocked</Badge></div>
          <div className="metric-row"><span>Private storage buckets</span><Badge tone="ok">Enabled</Badge></div>
          <div className="metric-row"><span>Live Paystack keys</span><Badge tone={process.env.PAYSTACK_SECRET_KEY?'ok':'warn'}>{process.env.PAYSTACK_SECRET_KEY?'Server only':'Not configured'}</Badge></div>
        </Panel>
      </div>
    </div>
  </>;
}
