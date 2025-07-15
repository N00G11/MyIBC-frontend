import { LeaderStats } from "@/components/leader/leader-stats";
import { LeaderCampDistribution } from "@/components/leader/leader-camp-distribution";
import { LeaderParticipantsList } from "@/components/leader/leader-participants-list";
import { LeaderActions } from "@/components/leader/leader-actions";
import { Suspense } from "react";

export default function LeaderDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#001F5B]">
          Mon tableau de bord
        </h1>
      </div>
          
        
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div>Chargement...</div>}>

            <LeaderCampDistribution />
            <LeaderParticipantsList />
         
          </Suspense>  

        </div>
        <div>
        <Suspense fallback={<div>Chargement...</div>}>
           <LeaderActions />
        </Suspense>  
        </div>
      </div>
    </div>
  );
}
