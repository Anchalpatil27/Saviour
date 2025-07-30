import { Activity, AlertCircle, BarChart2, CloudSun, Database, Navigation, Newspaper, PhoneCall, Shield, UserCircle, Users } from 'lucide-react'

export const sidebarItems = [
  { name: 'Dashboard', icon: Activity, href: '/dashboard' },
  { name: 'Profile', icon: UserCircle, href: '/dashboard/profile' },
  { name: 'SOS', icon: UserCircle, href: '/dashboard/sos' },
  { name: 'Alerts', icon: AlertCircle, href: '/dashboard/alerts' },
  { name: 'Navigation', icon: Navigation, href: '/dashboard/navigation' },
  { name: 'Resources', icon: Database, href: '/dashboard/resources' },
  { name: 'Weather', icon: CloudSun, href: '/dashboard/weather' },
  { name: 'Community', icon: Users, href: '/dashboard/community' },
  { name: 'Emergency', icon: PhoneCall, href: '/dashboard/emergency' },
  { name: 'Historical Data', icon: BarChart2, href: '/dashboard/historical' },
  { name: 'Safety', icon: Shield, href: '/dashboard/safety' },
]

