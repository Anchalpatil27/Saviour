import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, AlertTriangle, Info, Layers } from 'lucide-react'

export default async function RiskMapPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const highRiskAreas = [
    { name: 'Coastal Region A', risk: 'High' },
    { name: 'Mountain Valley B', risk: 'Moderate' },
    { name: 'Urban Center C', risk: 'Low' },
  ]

  const currentAlerts = [
    { type: 'Flood Warning', location: 'Region A', severity: 'High' },
    { type: 'Fire Risk', location: 'Region B', severity: 'Moderate' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Interactive Risk Map</h2>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center">
              <Map className="mr-2 h-5 w-5" />
              Risk Map
            </span>
            <Button variant="outline" size="sm">
              <Layers className="mr-2 h-4 w-4" />
              Toggle Layers
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center mb-4">
            <Map className="h-12 w-12 text-gray-400" />
            <span className="ml-2 text-gray-600 text-lg">Interactive Risk Map Placeholder</span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button className="flex-1">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Incident
            </Button>
            <Button variant="outline" className="flex-1">Full Screen</Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">High Risk Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {highRiskAreas.map((area, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span>{area.name}</span>
                  <Badge variant={area.risk === 'High' ? 'destructive' : area.risk === 'Moderate' ? 'default' : 'secondary'}>
                    {area.risk}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Current Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentAlerts.map((alert, index) => (
                <li key={index} className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                    {alert.type}: {alert.location}
                  </span>
                  <Badge variant={alert.severity === 'High' ? 'destructive' : 'default'}>
                    {alert.severity}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Info className="mr-2 h-4 w-4 text-blue-500" />
                <span>Stay informed about local warnings</span>
              </li>
              <li className="flex items-center text-sm">
                <Info className="mr-2 h-4 w-4 text-blue-500" />
                <span>Prepare an emergency kit</span>
              </li>
              <li className="flex items-center text-sm">
                <Info className="mr-2 h-4 w-4 text-blue-500" />
                <span>Know your evacuation routes</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

