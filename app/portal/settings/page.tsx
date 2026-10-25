import { AppHead } from '@/components/module-view';
import { Panel } from '@/components/ui';
export default function PortalSettings(){
  return <>
    <AppHead title="Settings" subtitle="Your profile, account security and notification preferences."/>
    <div className="split">
      <div>
        <Panel title="Profile information">
          <div className="form-grid">
            <div><label>Full name</label><input defaultValue="Amara Nwosu"/></div>
            <div><label>Email</label><input defaultValue="amara@example.com" type="email"/></div>
            <div><label>Phone / WhatsApp</label><input defaultValue="+234 800 000 0000"/></div>
            <div><label>Preferred contact method</label><select defaultValue="email"><option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="phone">Phone call</option></select></div>
            <div><label>Timezone</label><select defaultValue="lagos"><option value="lagos">Africa/Lagos (WAT)</option><option value="london">Europe/London</option></select></div>
            <div><label>Author / pen name</label><input defaultValue="Amara Nwosu"/></div>
          </div>
          <div className="row" style={{marginTop:20}}><button className="btn btn-primary btn-sm">Save changes</button><span className="small faint">Only permitted profile fields are editable by clients.</span></div>
        </Panel>
        <Panel title="Account security">
          <div className="metric-row"><span>Email verification</span><strong style={{color:'var(--ok)'}}>Verified</strong></div>
          <div className="metric-row"><span>Password</span><strong>Last changed 62 days ago</strong></div>
          <div className="metric-row"><span>Sessions</span><strong>1 active device</strong></div>
          <div className="row" style={{marginTop:16}}><button className="btn btn-outline btn-sm">Change password</button><button className="btn btn-ghost btn-sm">Sign out all devices</button></div>
        </Panel>
      </div>
      <div>
        <Panel title="Notifications">
          {[['Email notifications','Account, invoice and project updates',true],['In-app notifications','Approvals and messages',true],['Invoice & payment','New invoices and verified receipts',true],['Project updates','Milestones and deliverable approvals',true],['Marketing emails','Occasional author resources',false]].map(([t,d,on])=>(
            <div className="metric-row" key={String(t)}><span><strong style={{fontSize:'.85rem'}}>{t}</strong><span className="sub">{d}</span></span>
              <span className={`badge ${on?'badge-ok':'badge-neutral'}`}>{on?'On':'Off'}</span></div>
          ))}
          <div className="notice notice-teal" style={{marginTop:16,fontSize:'.8rem'}}><span>Notifications are deduplicated by event key, so a retried Paystack webhook will never send you a duplicate receipt.</span></div>
        </Panel>
        <Panel title="Data & privacy"><p className="small muted">You can request an export or deletion of personal data we are not legally required to retain. Invoices, verified payment records and audit events must be kept for tax and legal reasons.</p><button className="btn btn-outline btn-sm">Request data export</button></Panel>
      </div>
    </div>
  </>;
}
