import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts"
import { DashboardActions } from "@/components/admin/dashboard/dashboard-actions"
import { DashboardLeaderTable } from "@/components/admin/dashboard/dashboard-leader-table"
import { Suspense } from "react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">Tableau de bord</h1>

      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <DashboardStats />
      </Suspense>
      
      <Suspense fallback={<div>Chargement des graphiques...</div>}>
        <DashboardCharts />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">   
        <div>
          <Suspense fallback={<div>Chargement des actions...</div>}>
            <DashboardActions />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
