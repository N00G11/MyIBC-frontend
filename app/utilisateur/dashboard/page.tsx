"use client";

import { LeaderStats } from "@/components/leader/leader-stats";
import { LeaderCampDistribution } from "@/components/leader/leader-camp-distribution";
import { LeaderParticipantsList } from "@/components/leader/leader-participants-list";
import { LeaderActions } from "@/components/leader/leader-actions";
import Image from "next/image";

export default function LeaderDashboard() {
  return (
    <div className="space-y-6">
      {/* Header avec logo plus grand et mieux positionné */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-6">
          <Image
            src="/CMCI.png"
            alt="CMCI Logo"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
          <div>
            <h1 className="text-3xl font-bold text-[#001F5B]">
              Mon tableau de bord
            </h1>
            <p className="text-[#001F5B]/70 mt-1">Gestion des camps bibliques</p>
          </div>
        </div>
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
