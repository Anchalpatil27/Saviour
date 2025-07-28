import { Activity, AlertCircle, BarChart2, CloudSun, Database, Navigation, Shield, UserCircle, Users, AlertTriangle, Settings } from 'lucide-react'

export const adminSidebarItems = [
  { name: 'Dashboard', icon: Activity, href: '/admin-dashboard' },
  { name: 'SOS', icon: AlertTriangle, href: '/admin-dashboard/sos' },
  { name: 'Resources', icon: Database, href: '/admin-dashboard/resources' },
  { name: 'Safety', icon: Shield, href: '/admin-dashboard/safety' },
  { name: 'Weather', icon: CloudSun, href: '/admin-dashboard/weather' },
  { name: 'Navigation', icon: Navigation, href: '/admin-dashboard/navigation' },
  { name: 'Management', icon: Users, href: '/admin-dashboard/management' },
  { name: 'Profile', icon: UserCircle, href: '/admin-dashboard/profile' },
]
