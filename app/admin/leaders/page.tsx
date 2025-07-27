import { LeadersList } from "@/components/admin/leaders/leaders-list"
import { LeaderForm } from "@/components/admin/leaders/leader-form"
import { Suspense } from "react"

export default function LeadersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">
        Gestion des dirigeants
      </h1>
      <Suspense fallback={<div>Chargement de la liste des dirigeants...</div>}>
        <LeadersList />
      </Suspense>
    </div>
  );
}
