import { ParticipantInfo } from "@/components/participant/participant-info"
import { ParticipantBadge } from "@/components/participant/participant-badge"
import { CampInfo } from "@/components/participant/camp-info"
import { LeaderContact } from "@/components/participant/leader-contact"
import { Suspense } from "react"

export default function ParticipantDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div>Chargement...</div>}>

            <ParticipantInfo />
            <CampInfo />
            
          </Suspense>  
        </div>
        <div className="space-y-6">
          <Suspense fallback={<div>Chargement...</div>}>
          
            <ParticipantBadge />
            <LeaderContact />

          </Suspense>  
        </div>
      </div>
    </div>
  )
}
