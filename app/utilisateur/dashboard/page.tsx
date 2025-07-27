"use client";

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
      </div>

      {/* Section du haut avec la distribution des camps et les actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeaderCampDistribution />
        </div>
        <div className="lg:col-span-1">
          <LeaderActions />
        </div>
      </div>

      {/* Section du bas avec la liste des participants sur toute la largeur */}
      <div className="w-full">
        <LeaderParticipantsList />
      </div>
    </div>
  );
}
