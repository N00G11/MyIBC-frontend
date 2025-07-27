import { ParticipantInfo } from "@/components/participant/participant-info";
import { ParticipantBadge } from "@/components/participant/participant-badge";
import { CampInfo } from "@/components/participant/camp-info";
import { LeaderContact } from "@/components/participant/leader-contact";
import { Suspense } from "react";

export default function ParticipantDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Colonne gauche : ParticipantInfo + CampInfo */}
      <div className="space-y-6">
        <Suspense fallback={<div>Chargement...</div>}>
          <ParticipantInfo />
        </Suspense>
        <Suspense fallback={<div>Chargement...</div>}>
          <CampInfo />
        </Suspense>
      </div>

      {/* Colonne droite : ParticipantBadge + LeaderContact */}
      <div className="space-y-6">
        <Suspense fallback={<div>Chargement...</div>}>
          <ParticipantBadge />
        </Suspense>
      </div>
    </div>
  );
}
