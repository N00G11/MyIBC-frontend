import { LeadersList } from "@/components/admin/leaders/leaders-list"
import { LeaderForm } from "@/components/admin/leaders/leader-form"

export default function LeadersPage() {
  return (
    // <div className="space-y-6">
    //   <h1 className="text-2xl font-bold text-[#001F5B]">Gestion des dirigeants</h1>

    //   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    //     <div className="lg:col-span-2">
    //       <LeadersList />
    //     </div>
    //     <div>
    //       <LeaderForm />
    //     </div>
    //   </div>
    // </div>
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">
        Gestion des dirigeants
      </h1>
      <LeadersList />
    </div>
  );
}
