import { LocalisationsList } from "@/components/admin/localisations/localisations-list";
import { Suspense } from "react"

export default function LocalisationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">Gestion des localisations</h1>
      <Suspense fallback={<div>Chargement de la liste des localisations...</div>}>
        <LocalisationsList />
      </Suspense>
    </div>
  )
}