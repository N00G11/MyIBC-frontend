import { LeadersList } from "@/components/admin/leaders/leaders-list"
import { LeaderForm } from "@/components/admin/leaders/leader-form"

export default function LeadersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">
        Gestion des dirigeants
      </h1>
      <LeadersList />
    </div>
  );
}
