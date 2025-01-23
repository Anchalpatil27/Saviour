import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, Bell, Radio } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default async function NewsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const newsItems = [
    { id: 1, title: "Local Flood Warning Issued", source: "City Emergency Services", category: "Alert" },
    { id: 2, title: "New Evacuation Routes Announced", source: "Transportation Department", category: "Update" },
    { id: 3, title: "Community Preparedness Workshop This Weekend", source: "SAVIOUR Organization", category: "Event" },
    { id: 4, title: "Updated Safety Guidelines Released", source: "National Safety Board", category: "Update" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Local News & Updates</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {newsItems.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl flex items-center justify-between">
                <span className="flex items-center">
                  <Newspaper className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {item.title}
                </span>
                <Badge variant={item.category === 'Alert' ? 'destructive' : item.category === 'Update' ? 'default' : 'secondary'}>
                  {item.category}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-gray-500 mb-4">Source: {item.source}</p>
              <Button className="w-full mt-auto text-sm sm:text-base">
                Read More
                <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Emergency Broadcasts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Radio className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 animate-pulse mr-2" />
                <p className="text-xs sm:text-sm font-semibold">LIVE: Emergency Broadcast</p>
              </div>
              <Badge variant="destructive">URGENT</Badge>
            </div>
            <p className="text-xs sm:text-sm mt-2">Severe thunderstorm warning for the next 3 hours. Seek shelter immediately.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1 text-sm sm:text-base">
              <Bell className="mr-2 h-4 w-4" />
              Enable Notifications
            </Button>
            <Button variant="outline" className="flex-1 text-sm sm:text-base">View All Broadcasts</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

