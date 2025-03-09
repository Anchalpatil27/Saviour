import { Activity, AlertCircle, BarChart2, BookOpen, CloudSun, Database, Map, MessageCircle, Navigation, Newspaper, Package, PhoneCall, Shield, UserCircle, Users } from 'lucide-react'

export const sidebarItems = [
  { name: 'Dashboard', icon: Activity, href: '/dashboard' },
  { name: 'Profile', icon: UserCircle, href: '/dashboard/profile' },
  { name: 'Alerts', icon: AlertCircle, href: '/dashboard/alerts' },
  { name: 'Navigation', icon: Navigation, href: '/dashboard/navigation' },
  { name: 'Resources', icon: Database, href: '/dashboard/resources' },
  { name: 'Weather', icon: CloudSun, href: '/dashboard/weather' },
  { name: 'Community', icon: Users, href: '/dashboard/community' },
  { name: 'Emergency', icon: PhoneCall, href: '/dashboard/emergency' },
  { name: 'Historical Data', icon: BarChart2, href: '/dashboard/historical' },
  { name: 'Supply Chain', icon: Package, href: '/dashboard/supply-chain' },
  { name: 'News', icon: Newspaper, href: '/dashboard/news' },
  { name: 'Risk Map', icon: Map, href: '/dashboard/risk-map' },
  { name: 'Safety', icon: Shield, href: '/dashboard/safety' },
  { name: 'Training', icon: BookOpen, href: '/dashboard/training' },
  { name: 'Forum', icon: MessageCircle, href: '/dashboard/forum' },
]

