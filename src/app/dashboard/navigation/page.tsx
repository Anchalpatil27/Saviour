import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mountain } from "lucide-react"
import { UserLocationMap } from "@/components/UserLocationMap"

export default async function NavigationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // Sample data for high altitude locations
  const highAltitudes = [
    { id: 1, name: "Mount Ridge", elevation: "1,250 ft", status: "Accessible", risk: "Low" },
    { id: 2, name: "Eagle Peak", elevation: "2,340 ft", status: "Caution", risk: "Medium" },
    { id: 3, name: "Summit Point", elevation: "3,120 ft", status: "Dangerous", risk: "High" },
  ]

  const evacuationCenters = [
    { id: 1, name: "City Hall Shelter", distance: "2.5 miles", capacity: "80%" },
    { id: 2, name: "Central High School", distance: "3.8 miles", capacity: "65%" },
    { id: 3, name: "Community Center", distance: "5.2 miles", capacity: "45%" },
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
            <UserLocationMap />
            <p className="text-sm mt-2">Your current location</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Mountain className="mr-2 h-5 w-5" />
              High Altitudes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Elevation</th>
                    <th className="pb-2">Risk</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {highAltitudes.map((location) => (
                    <tr key={location.id} className="border-t">
                      <td className="py-2">{location.name}</td>
                      <td className="py-2">{location.elevation}</td>
                      <td className="py-2">
                        <Badge
                          variant={
                            location.risk === "High"
                              ? "destructive"
                              : location.risk === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {location.risk}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <Button size="sm">Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                      <Badge
                        variant={
                          Number.parseInt(center.capacity) > 70
                            ? "destructive"
                            : Number.parseInt(center.capacity) > 50
                              ? "default"
                              : "secondary"
                        }
                      >
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

