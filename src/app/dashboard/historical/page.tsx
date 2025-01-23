import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Calendar, FileText, TrendingUp, AlertTriangle } from 'lucide-react'

export default async function HistoricalPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const recentEvents = [
    { date: '2023-05-15', type: 'Flood', severity: 'Moderate', affected: 5000 },
    { date: '2023-03-22', type: 'Wildfire', severity: 'Severe', affected: 10000 },
    { date: '2022-11-10', type: 'Earthquake', severity: 'Minor', affected: 2000 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Historical Data & Analytics</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart className="mr-2 h-5 w-5" />
              Disaster Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center mb-4">
              Trend Chart Placeholder
            </div>
            <Button className="w-full">View Detailed Trends</Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Event Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 mb-4">
              {recentEvents.map((event, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span>{event.date}</span>
                  <span>{event.type}</span>
                  <span className="text-muted-foreground">{event.affected} affected</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">Open Full Timeline</Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="mr-2 h-5 w-5" />
              Reports Archive
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 mb-4">
              <li className="flex justify-between items-center text-sm">
                <span>Annual Disaster Summary 2023</span>
                <Button variant="outline" size="sm">Download</Button>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>Flood Impact Analysis</span>
                <Button variant="outline" size="sm">Download</Button>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>Earthquake Preparedness Report</span>
                <Button variant="outline" size="sm">Download</Button>
              </li>
            </ul>
            <Button className="w-full">Browse All Reports</Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Data Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Disaster Frequency Chart</span>
            </div>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Severity Distribution</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

