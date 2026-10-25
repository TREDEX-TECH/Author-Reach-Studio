import { DashboardFrame } from '@/components/dashboard-frame';
import { portalNav } from '@/lib/navigation';
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <DashboardFrame nav={portalNav} roleArea="portal" areaLabel="Client portal"
    person={{name:'Amara Nwosu',initials:'AN',role:'Author / client'}}>{children}</DashboardFrame>;
}
