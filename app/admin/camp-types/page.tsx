import { CampTypesList } from "@/components/admin/camp-types/camp-types-list"
import { CampTypeForm } from "@/components/admin/camp-types/camp-type-form"

export default function CampTypesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">Types de camps</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CampTypesList />
        </div>
        <div>
          <CampTypeForm />
        </div>
      </div>
    </div>
  )
}
