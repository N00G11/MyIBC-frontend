import { BadgeGenerator } from "@/components/admin/badges/badge-generator"
import { BadgePreview } from "@/components/admin/badges/badge-preview"

export default function BadgesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">Génération de badges</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BadgePreview />
        </div>
        <div>
          <BadgeGenerator />
        </div>
      </div>
    </div>
  )
}
