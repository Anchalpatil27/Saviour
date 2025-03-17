import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { AlertsTable } from "@/components/admin/AlertsTable"
import { CityFilter } from "@/components/admin/CityFilter"
// Import the safe MongoDB functions instead of direct MongoDB
import { findOne, find } from "@/lib/mongodb-safe"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

async function getAlerts(adminCity: string) {
  try {
    // Use the safe find function instead of direct MongoDB access
    const alerts = await find("alerts", { city: adminCity }, { sort: { createdAt: -1 }, limit: 100 })

    return alerts.map((alert: any) => ({
      id: alert._id.toString(),
      title: alert.title || "Untitled Alert",
      message: alert.message || "",
      type: alert.type || "info",
      city: alert.city || "All Cities",
      active: alert.active || false,
      createdAt: alert.createdAt || new Date(),
      // Add the missing properties required by the Alert type
      severity: alert.severity || "medium", // Default to medium if not specified
      expiresAt: alert.expiresAt || null, // Can be null according to your interface
    }))
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return []
  }
}

export default async function AlertsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  // Get admin's city using the safe findOne function
  const adminUser = await findOne("users", { email: session.user.email }, { city: 1 })

  if (!adminUser?.city) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Alert Management</h1>
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <p className="mb-4">
                {!adminUser
                  ? "Your admin profile doesn't exist in the database yet."
                  : "Please set your city in your profile to manage alerts."}
              </p>
              <Link href="/admin/setup-profile">
                <Button>{!adminUser ? "Set Up Admin Profile" : "Update Admin Profile"}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const adminCity = adminUser.city
  const alerts = await getAlerts(adminCity)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alert Management</h1>
        <Link href={`/admin/alerts/create?city=${adminCity}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Alert
          </Button>
        </Link>
      </div>

      <CityFilter adminCity={adminCity} />

      <Card>
        <CardHeader>
          <CardTitle>
            Alerts in {adminCity}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({alerts.length} {alerts.length === 1 ? "alert" : "alerts"})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search alerts..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <AlertsTable alerts={alerts} preserveCity={adminCity} />
        </CardContent>
      </Card>
    </div>
  )
}

