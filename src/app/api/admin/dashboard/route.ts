import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get city from query params
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")

    if (!city) {
      return NextResponse.json(
        {
          error: "Admin profile not set up or city parameter is missing",
          adminSetupRequired: true,
        },
        { status: 400 },
      )
    }

    try {
      const { db } = await connectToMongoDB()

      // Build queries based on city parameter
      const userQuery = { city }
      const alertQuery = { city }
      const resourceQuery = { city }

      // Fetch counts from various collections with city filter
      const usersCount = await db.collection("users").countDocuments(userQuery)
      const alertsCount = await db.collection("alerts").countDocuments(alertQuery)
      const resourcesCount = await db.collection("resources").countDocuments(resourceQuery)

      // Fetch recent activity for the city
      const activityQuery = { details: { $regex: city, $options: "i" } }

      const recentActivity = await db
        .collection("activity_logs")
        .find(activityQuery)
        .sort({ timestamp: -1 })
        .limit(5)
        .toArray()

      return NextResponse.json({
        counts: {
          users: usersCount,
          alerts: alertsCount,
          resources: resourcesCount,
        },
        recentActivity: recentActivity.map((activity) => ({
          id: activity._id.toString(),
          action: activity.action,
          details: activity.details,
          timestamp: activity.timestamp,
          userId: activity.userId,
        })),
      })
    } catch (dbError) {
      console.error("Database error in dashboard API:", dbError)
      return NextResponse.json(
        {
          error: `Database connection error: ${dbError instanceof Error ? dbError.message : String(dbError)}`,
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      {
        error: `Failed to fetch dashboard data: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

