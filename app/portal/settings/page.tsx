import { AppHead, KpiRow } from '@/components/module-view';
import { Panel } from '@/components/ui';
import { getSnapshot } from '@/lib/data/live';
import { requireAuth, SITE } from '@/lib/config';
import { SignOutButton } from '@/components/sign-out-button';
export default async function PortalSettings(){
  const s = await getSnapshot();
  return <>
    <AppHead title="Settings" subtitle="Your profile, notification preferences and privacy."/>
    <KpiRow items={[{label:'Account type',value:'Client'},{label:'Access mode',value:requireAuth()?'Sign-in required':'Open read preview'},{label:'Currency',value:'USD'},{label:'Theme',value:'Light / dark'}]}/>
    <div className="split">
      <Panel title="Profile"><div className="metric-row"><span>Name</span><strong>Set on your account</strong></div>
        <div className="metric-row"><span>Email</span><strong>Set on your account</strong></div>
        <div className="metric-row"><span>Support contact</span><strong>{SITE.email}</strong></div>
        <p className="small faint" style={{marginTop:14}}>Sign in to manage your profile, contact details and notification preferences. Contact us if your invitation has not arrived.</p>
        <div className="row" style={{marginTop:14}}><SignOutButton/></div></Panel>
      <Panel title="Privacy"><p className="small muted" style={{margin:'0 0 14px'}}>Your data is protected by Supabase Auth and row-level security. You can see only your own books, projects, proposals, invoices and approved deliverables. Internal staff notes, other clients’ data and internal cost information are never exposed.</p>
        <div className="metric-row"><span>Private records visible</span><strong>{s.counts.projects + s.counts.invoices + s.counts.files}</strong></div>
        <div className="metric-row"><span>Private file storage</span><strong>Enabled</strong></div>
        <div className="metric-row"><span>Signed URLs</span><strong>Short-lived</strong></div>
      </Panel>
    </div>
  </>;
}
