"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Calendar, FileText, TrendingUp, AlertTriangle, Download } from "lucide-react"
import { fetchHistoricalData, type HistoricalData } from "@/lib/actions/historical-actions"
import { Skeleton } from "@/components/ui/skeleton"

interface HistoricalDataDisplayProps {
  coordinates: { lat: number; lng: number } | null
}

export function HistoricalDataDisplay({ coordinates }: HistoricalDataDisplayProps) {
  const [data, setData] = useState<HistoricalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadHistoricalData() {
      if (!coordinates) {
        setError("Location coordinates are required to fetch historical data")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await fetchHistoricalData(coordinates.lat, coordinates.lng)

        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error || "Failed to fetch historical data")
        }
      } catch (err) {
        console.error("Error loading historical data:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    loadHistoricalData()
  }, [coordinates])

  if (loading) {
    return <HistoricalDataSkeleton />
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Historical Data & Analytics</h2>
        <Card className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Unable to Load Historical Data</h3>
            <p className="text-muted-foreground mb-4">{error || "No data available"}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Minor":
        return "bg-blue-100 text-blue-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Severe":
        return "bg-orange-100 text-orange-800"
      case "Catastrophic":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
            <div className="h-48 bg-muted rounded-md p-4 mb-4 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="pb-2">Year</th>
                    <th className="pb-2">Count</th>
                    <th className="pb-2">Primary Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.trends.map((trend, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="py-1">{trend.year}</td>
                      <td className="py-1">{trend.count}</td>
                      <td className="py-1">{trend.primaryType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button className="w-full">View Detailed Trends</Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 mb-4 h-48 overflow-y-auto">
              {data.events.map((event) => (
                <li key={event.id} className="text-sm border-b pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{event.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{event.date}</span>
                    <span>{event.affected.toLocaleString()} affected</span>
                  </div>
                  <p className="text-xs mt-1">{event.description}</p>
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
            <ul className="space-y-2 mb-4 h-48 overflow-y-auto">
              {data.reports.map((report) => (
                <li key={report.id} className="text-sm border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{report.title}</span>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{report.date}</span>
                    <span>{report.fileSize}</span>
                  </div>
                  <p className="text-xs mt-1 line-clamp-2">{report.summary}</p>
                </li>
              ))}
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
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Disaster Frequency by Type
              </h3>
              <div className="space-y-2">
                {data.frequencyData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.type}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(item.count / Math.max(...data.frequencyData.map((d) => d.count))) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Severity Distribution
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {data.severityData.map((item, index) => (
                  <div key={index} className="bg-background p-3 rounded-md text-center">
                    <div className="text-2xl font-bold">{item.count}</div>
                    <div
                      className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${getSeverityColor(item.severity)}`}
                    >
                      {item.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HistoricalDataSkeleton() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Historical Data & Analytics</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

