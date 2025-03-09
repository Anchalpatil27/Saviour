import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserLocationMap } from "@/components/UserLocationMap"
import { MidAltitudeTable } from "@/components/mid-altitude-table"

export default async function NavigationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const evacuationCenters = [
    { id: 1, name: "City Hall Shelter", distance: "2.5 miles", capacity: "80%" },
    { id: 2, name: "Central High School", distance: "3.8 miles", capacity: "65%" },
    { id: 3, name: "Community Center", distance: "5.2 miles", capacity: "45%" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Navigation & Evacuation</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <UserLocationMap />
        </div>
        <MidAltitudeTable />
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

