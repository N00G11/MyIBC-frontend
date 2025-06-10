import { ParticipantsList } from "@/components/admin/participants/participants-list"
import { ParticipantForm } from "@/components/admin/participants/participant-form"

export default function ParticipantsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">Gestion des participants</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ParticipantsList />
        </div>
        <div>
          <ParticipantForm />
        </div>
      </div>
    </div>
  )
}
