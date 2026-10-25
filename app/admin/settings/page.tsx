import { AppHead, KpiRow } from '@/components/module-view';
import { Panel, Badge } from '@/components/ui';
export default function AdminSettings(){
  return <>
    <AppHead title="Settings & roles" subtitle="Configurable business rules, roles, permissions and integration status."/>
    <div className="notice" style={{marginBottom:20}}><strong>Confirmation needed.</strong>&nbsp; Every setting below has a recommended default in <code>docs/02-decisions-register.md</code>. Please confirm or change each one before the relevant workflow is built.</div>
    <KpiRow items={[{label:'Roles',value:'8'},{label:'Permissions',value:'14'},{label:'Config keys',value:'12'},{label:'Integrations live',value:'0',delta:'Awaiting credentials',negative:true}]}/>
    <div className="split">
      <div>
        <Panel title="Application settings" flush>
          <div className="table-wrap"><table><thead><tr><th>Key</th><th>Value</th><th>Visibility</th><th>Status</th></tr></thead><tbody>
            {[
              ['payments.allow_partial','false','Server only','Default'],
              ['payments.currencies','["USD"]','Server only','Confirm'],
              ['payments.provider','"paystack"','Server only','Default'],
              ['invoices.payment_terms_days','14','Server only','Default'],
              ['proposals.validity_days','30','Server only','Confirm'],
              ['registration.clients','"invite_only"','Server only','Confirm'],
              ['registration.staff','"admin_invite"','Server only','Default'],
              ['files.max_document_mb','25','Server only','Confirm'],
              ['files.max_video_mb','500','Server only','Confirm'],
              ['branding.brand_name','"Author Reach Studio"','Public','Set'],
            ].map(([k,v,vis,st])=>(
              <tr key={k}><td><code style={{fontSize:'.78rem'}}>{k}</code></td><td><code style={{fontSize:'.78rem'}}>{v}</code></td>
              <td><span className="small faint">{vis}</span></td><td><Badge tone={st==='Confirm'?'warn':'ok'}>{st}</Badge></td></tr>
            ))}
          </tbody></table></div>
        </Panel>
        <Panel title="Integration status">
          {[['Supabase','Not connected','warn'],['Paystack','Test keys pending','warn'],['Email provider','Not configured','warn'],['Netlify','Deploy pending','neutral'],['Custom domain','DNS pending','neutral']].map(([n,s,t])=>(
            <div className="metric-row" key={n}><span><strong style={{fontSize:'.85rem'}}>{n}</strong></span><Badge tone={t}>{s}</Badge></div>
          ))}
          <div className="notice" style={{marginTop:16,fontSize:'.8rem'}}><strong>Never paste secrets here.</strong> Secret keys belong in Netlify’s environment UI and Supabase’s dashboard. They are never stored in ordinary database records or committed to the repository.</div>
        </Panel>
      </div>
      <div>
        <Panel title="Roles">
          {[['visitor','Public visitor'],['author','Author / client'],['team_member','Team member'],['department_head','Department head'],['project_manager','Project manager'],['finance_officer','Finance officer'],['administrator','Administrator'],['executive','Executive / owner']].map(([s,n])=>(
            <div className="metric-row" key={s}><span><code style={{fontSize:'.78rem'}}>{s}</code><span className="sub">{n}</span></span><a href="#" className="btn btn-ghost btn-sm">Edit</a></div>
          ))}
        </Panel>
        <Panel title="Security posture">
          <div className="metric-row"><span>RLS on all tables</span><Badge tone="ok">Enabled</Badge></div>
          <div className="metric-row"><span>Service-role key in browser</span><Badge tone="ok">Never</Badge></div>
          <div className="metric-row"><span>Payment writes from client</span><Badge tone="ok">Blocked</Badge></div>
          <div className="metric-row"><span>User self role-grant</span><Badge tone="ok">Blocked</Badge></div>
          <div className="metric-row"><span>Private storage buckets</span><Badge tone="ok">4 of 5</Badge></div>
          <div className="metric-row"><span>Backup restore tested</span><Badge tone="danger">Not yet</Badge></div>
          <div className="metric-row"><span>Live Paystack keys</span><Badge tone="warn">Phase 8 only</Badge></div>
        </Panel>
      </div>
    </div>
  </>;
}
