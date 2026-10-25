import { DashboardFrame } from '@/components/dashboard-frame';
import { workspaceNav } from '@/lib/navigation';
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <DashboardFrame nav={workspaceNav} roleArea="workspace" areaLabel="Team workspace"
    person={{name:'Aisha Bello',initials:'AB',role:'Creative Designer'}}>{children}</DashboardFrame>;
}
