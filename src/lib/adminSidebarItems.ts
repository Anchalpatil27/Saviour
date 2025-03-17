import { UserCircle, AlertCircle, Navigation, Database, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface SidebarItem {
  name: string
  icon: LucideIcon
  href: string
}

export const adminSidebarItems: SidebarItem[] = [
  { name: "Profile", icon: UserCircle, href: "/admin/profile" },
  { name: "Alerts", icon: AlertCircle, href: "/admin/alerts" },
  { name: "Navigation", icon: Navigation, href: "/admin/navigation" },
  { name: "Resources", icon: Database, href: "/admin/resources" },
  { name: "Users", icon: Users, href: "/admin/users" },
]

