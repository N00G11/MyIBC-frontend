import { LeaderStats } from "@/components/leader/leader-stats";
import { LeaderCampDistribution } from "@/components/leader/leader-camp-distribution";
import { LeaderParticipantsList } from "@/components/leader/leader-participants-list";
import { LeaderActions } from "@/components/leader/leader-actions";

export default function LeaderDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#001F5B]">
          Mon tableau de bord
        </h1>
        <div className="text-sm text-gray-600">
          Centre Évangélique - Paris, France
        </div>
      </div>

      <LeaderStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LeaderCampDistribution />
          <LeaderParticipantsList />
        </div>
        <div>
          <LeaderActions />
        </div>
      </div>
    </div>
  );
}
