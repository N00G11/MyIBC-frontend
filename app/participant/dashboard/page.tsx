import { ParticipantInfo } from "@/components/participant/participant-info"
import { ParticipantBadge } from "@/components/participant/participant-badge"
import { CampInfo } from "@/components/participant/camp-info"
import { LeaderContact } from "@/components/participant/leader-contact"

export default function ParticipantDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ParticipantInfo />
          <CampInfo />
        </div>
        <div className="space-y-6">
          <ParticipantBadge />
          <LeaderContact />
        </div>
      </div>
    </div>
  )
}
