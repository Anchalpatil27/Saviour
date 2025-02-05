"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, HandHelping, MessageSquare, TrendingUp } from "lucide-react"
import { CommunityForm } from "@/components/CommunityForm"
import { Button } from "@/components/ui/button"
import { CommunityChat } from "@/components/CommunityChat"
import clientPromise from "@/lib/mongodb"

async function getUserDetails(email: string) {
  try {
    const client = await clientPromise
    const db = client.db("test")
    const user = await db.collection("users").findOne({ email })
    return user
  } catch (error) {
    console.error("Error fetching user details:", error)
    return null
  }
}

export default function CommunityPage() {
  const [messageCount, setMessageCount] = useState(0)
  const [userCity, setUserCity] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserCity() {
      const response = await fetch("/api/get-user-city")
      const data = await response.json()
      setUserCity(data.city)
    }
    fetchUserCity()
  }, [])

  useEffect(() => {
    if (!userCity) return

    const eventSource = new EventSource("/api/sse")

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessageCount(data.count)
    }

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [userCity])

  const stats = [
    { name: "Active Volunteers", icon: Users, value: 127, change: 12 },
    { name: "Open Requests", icon: HandHelping, value: 15, change: -3 },
    { name: "Community Messages", icon: MessageSquare, value: messageCount, change: null },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Community Support</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
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
                    className={`h-3 w-3 mr-1 ${stat.change > 0 ? "text-green-500" : "text-red-500 transform rotate-180"}`}
                  />
                  {Math.abs(stat.change)} since last week
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Offer or Request Support</CardTitle>
          </CardHeader>
          <CardContent>
            <CommunityForm />
          </CardContent>
        </Card>
        <CommunityChat userCity={userCity} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Community Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <span className="text-sm">Food distribution event organized</span>
              <Button size="sm">View Details</Button>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Volunteer training session scheduled</span>
              <Button size="sm">View Details</Button>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Community cleanup initiative started</span>
              <Button size="sm">View Details</Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

