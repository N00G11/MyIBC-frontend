import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts"
import { DashboardActions } from "@/components/admin/dashboard/dashboard-actions"
import { DashboardLeaderTable } from "@/components/admin/dashboard/dashboard-leader-table"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">Tableau de bord</h1>

      <DashboardStats />
      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardLeaderTable />
        </div>
        <div>
          <DashboardActions />
        </div>
      </div>
    </div>
  )
}
