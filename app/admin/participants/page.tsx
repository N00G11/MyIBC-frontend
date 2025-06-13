import { InscriptionsList } from "@/components/admin/participants/participants-list"
import { ParticipantForm } from "@/components/admin/participants/participant-form"

export default function ParticipantsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">Gestion des participants</h1>
        <div className="lg:col-span-2">
          <InscriptionsList />
        </div>
    </div>
  )
}
