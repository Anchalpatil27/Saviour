import { Card, CardContent } from "@/components/ui/card"
import { Users, BookOpen, Bell, MessageSquare } from "lucide-react"

// Define the props interface with the stats property
export interface DashboardStatsProps {
  stats: {
    userCount: number
    resourceCount: number
    alertCount: number
    messageCount: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-10 w-10 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.userCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-10 w-10 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resources</p>
              <h3 className="text-2xl font-bold">{stats.resourceCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Bell className="h-10 w-10 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Alerts</p>
              <h3 className="text-2xl font-bold">{stats.alertCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-10 w-10 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Messages</p>
              <h3 className="text-2xl font-bold">{stats.messageCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

