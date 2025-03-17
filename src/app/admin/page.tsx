export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/admin/DashboardStats"
// Import the safe MongoDB functions instead of direct MongoDB
import { findOne, countDocuments } from "@/lib/mongodb-safe"

async function getDashboardStats(adminCity: string) {
  try {
    // Use the safe countDocuments function instead of direct MongoDB access
    const userCount = await countDocuments("users", { city: adminCity })
    const resourceCount = await countDocuments("resources", { city: adminCity })
    const alertCount = await countDocuments("alerts", { city: adminCity })
    const messageCount = await countDocuments("messages", { city: adminCity })

    return {
      userCount,
      resourceCount,
      alertCount,
      messageCount,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      userCount: 0,
      resourceCount: 0,
      alertCount: 0,
      messageCount: 0,
    }
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  // Get admin's city using the safe findOne function
  const adminUser = await findOne("users", { email: session.user.email }, { city: 1 })

  if (!adminUser?.city) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <p className="mb-4">
                {!adminUser
                  ? "Your admin profile doesn't exist in the database yet."
                  : "Please set your city in your profile to view the dashboard."}
              </p>
              <a
                href="/admin/setup-profile"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {!adminUser ? "Set Up Admin Profile" : "Update Admin Profile"}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const adminCity = adminUser.city
  const stats = await getDashboardStats(adminCity)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview for {adminCity}</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardStats stats={stats} />
        </CardContent>
      </Card>
    </div>
  )
}

