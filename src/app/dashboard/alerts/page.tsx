import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Info, MapPin } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Severe Thunderstorm",
    message: "Expected in your area within the next 2 hours.",
    location: "City Center",
  },
  {
    id: 2,
    type: "info",
    title: "Road Closure",
    message: "Main Street closed due to flooding. Use alternate routes.",
    location: "Downtown",
  },
  {
    id: 3,
    type: "danger",
    title: "Evacuation Order",
    message: "Immediate evacuation required for Coastal Zone A.",
    location: "Coastal Area",
  },
  {
    id: 4,
    type: "warning",
    title: "High Wind Advisory",
    message: "Strong winds expected. Secure loose outdoor items.",
    location: "Citywide",
  },
]

export default async function AlertsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Real-Time Alerts</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {alerts.map((alert) => (
          <Card key={alert.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                {alert.type === "warning" && <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />}
                {alert.type === "info" && <Info className="mr-2 h-5 w-5 text-blue-500" />}
                {alert.type === "danger" && <Bell className="mr-2 h-5 w-5 text-red-500" />}
                {alert.title}
              </CardTitle>
              <Badge
                variant={alert.type === "warning" ? "default" : alert.type === "danger" ? "destructive" : "secondary"}
              >
                {alert.type.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{alert.message}</p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="mr-1 h-4 w-4" />
                {alert.location}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

