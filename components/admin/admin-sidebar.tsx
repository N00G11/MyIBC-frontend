import { CmciLogo } from "@/components/cmci-logo"
import { AdminSidebarContent } from "./admin-sidebar-content"

export function AdminSidebar() {
  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-[#001F5B] text-white">
      <div className="p-4 border-b border-blue-900 flex justify-center">
      {/* <CmciLogo  /> */}  
      </div>
      <AdminSidebarContent />
    </aside>
  )
}
