import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, HandHelping, MessageSquare, TrendingUp } from "lucide-react"
import { CommunityForm } from "@/components/CommunityForm"
import CommunityChat from "@/components/CommunityChat"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { connectToDatabase } from "@/lib/mongodb"

export default async function CommunityPage() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      redirect("/auth/login")
    }

    // Verify database connection before proceeding
    const { db } = await connectToDatabase()
    const stats = (await db.collection("stats").findOne({ type: "community" })) || {
      activeVolunteers: 0,
      openRequests: 0,
      messages: 0,
      volunteersChange: 0,
      requestsChange: 0,
    }

    const communityStats = [
      {
        name: "Active Volunteers",
        icon: Users,
        value: stats.activeVolunteers || 0,
        change: stats.volunteersChange || 0,
      },
      {
        name: "Open Requests",
        icon: HandHelping,
        value: stats.openRequests || 0,
        change: stats.requestsChange || 0,
      },
      {
        name: "Community Messages",
        icon: MessageSquare,
        value: stats.messages || 0,
        change: null,
      },
    ]

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Community Support</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communityStats.map((stat) => (
            <Card key={stat.name} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change !== null && (
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <TrendingUp
                      className={`h-3 w-3 mr-1 ${
                        stat.change > 0 ? "text-green-500" : "text-red-500 transform rotate-180"
                      }`}
                    />
                    {Math.abs(stat.change)} since last week
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ErrorBoundary fallback={<div>Error loading community form</div>}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offer or Request Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CommunityForm />
              </CardContent>
            </Card>
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Error loading community chat</div>}>
            <CommunityChat />
          </ErrorBoundary>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in CommunityPage:", error)
    throw new Error("Failed to load community page")
  }
}

