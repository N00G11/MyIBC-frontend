"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  UserCheck, 
  MapPin, 
  DollarSign,
  Calendar
} from "lucide-react"

const menuItems = [
  {
    title: "Tableau de bord",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    title: "Trésoriers",
    href: "/admin/tresoriers",
    icon: UserCheck,
  },
  {
    title: "Participants",
    href: "/admin/participants",
    icon: Users,
  },
  {
    title: "Localisations",
    href: "/admin/localisations",
    icon: MapPin,
  },
  {
    title: "Déroulement du camp",
    href: "/admin/camp-info",
    icon: Calendar,
  }
]

export function AdminSidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  pathname === item.href ? "bg-[#D4AF37] text-white" : "text-gray-200 hover:bg-blue-900",
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 text-xs text-gray-400 border-t border-blue-900">
        <p>MyIBC CMCI</p>
      </div>
    </div>
  )
}
