import { DashboardFrame } from '@/components/dashboard-frame';
import { adminNav } from '@/lib/navigation';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardFrame nav={adminNav} roleArea="admin" areaLabel="Management"
    person={{name:'Tola Adebayo',initials:'TA',role:'Administrator'}}>{children}</DashboardFrame>;
}
