import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, AlertTriangle, Compass } from 'lucide-react'

export default async function NavigationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const routes = [
    { id: 1, name: 'Route A', status: 'Congested', icon: AlertTriangle, iconColor: 'text-yellow-500' },
    { id: 2, name: 'Route B', status: 'Clear', icon: Compass, iconColor: 'text-green-500' },
    { id: 3, name: 'Route C', status: 'Closed', icon: AlertTriangle, iconColor: 'text-red-500' },
  ]

  const evacuationCenters = [
    { id: 1, name: 'City Hall Shelter', distance: '2.5 miles', capacity: '80%' },
    { id: 2, name: 'Central High School', distance: '3.8 miles', capacity: '65%' },
    { id: 3, name: 'Community Center', distance: '5.2 miles', capacity: '45%' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Navigation & Evacuation</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="bg-gray-200 h-48 md:h-64 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-600">Map Placeholder</span>
            </div>
            <p className="text-sm mb-2">IIITDM Jabalpur</p>
            <Button className="w-full">Update Location</Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Navigation className="mr-2 h-5 w-5" />
              Evacuation Routes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 mb-4">
              {routes.map((route) => (
                <li key={route.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <route.icon className={`mr-2 h-4 w-4 ${route.iconColor}`} />
                    {route.name}: {route.status}
                  </span>
                  <Button size="sm" variant="outline">Details</Button>
                </li>
              ))}
            </ul>
            <Button className="w-full">Get Directions</Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evacuation Centers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Distance</th>
                  <th className="pb-2">Capacity</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {evacuationCenters.map((center) => (
                  <tr key={center.id} className="border-t">
                    <td className="py-2">{center.name}</td>
                    <td className="py-2">{center.distance}</td>
                    <td className="py-2">
                      <Badge variant={
                        parseInt(center.capacity) > 70 ? 'destructive' :
                        parseInt(center.capacity) > 50 ? 'default' : 'secondary'
                      }>
                        {center.capacity}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <Button size="sm">Navigate</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

