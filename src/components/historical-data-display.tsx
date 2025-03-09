"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Calendar, TrendingUp, AlertTriangle, MapPin, Info, RefreshCw } from "lucide-react"
import {
  fetchHistoricalData,
  type HistoricalData,
  type DisasterTrend,
  type DisasterEvent,
} from "@/lib/actions/historical-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface HistoricalDataDisplayProps {
  coordinates: { lat: number; lng: number } | null
}

interface FrequencyDataItem {
  type: string
  count: number
}

interface SeverityDataItem {
  severity: string
  count: number
}

export function HistoricalDataDisplay({ coordinates }: HistoricalDataDisplayProps) {
  const [data, setData] = useState<HistoricalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isSampleData, setIsSampleData] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    async function loadHistoricalData() {
      if (!coordinates) {
        setError("Location coordinates are required to fetch historical data")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        setIsSampleData(false)

        console.log(`Fetching historical data for coordinates: ${coordinates.lat}, ${coordinates.lng}`)
        const result = await fetchHistoricalData(coordinates.lat, coordinates.lng)

        if (result.success) {
          setData(result.data)
          setIsSampleData(!!result.data.isSampleData)
          console.log("Successfully loaded historical data")

          if (result.error) {
            setError(result.error)
          }
        } else {
          console.error("Error from historical data action:", result.error)
          setError(result.error || "Failed to fetch historical data")
        }
      } catch (err) {
        console.error("Error loading historical data:", err)
        setError("An unexpected error occurred while fetching historical data")
      } finally {
        setLoading(false)
      }
    }

    loadHistoricalData()
  }, [coordinates, retryCount])

  const handleRefresh = () => {
    setRefreshing(true)
    setRetryCount((prev) => prev + 1)
    // The refresh state will be reset when the data loading completes in the useEffect
    setTimeout(() => {
      if (refreshing) setRefreshing(false) // Safety timeout in case loading takes too long
    }, 10000)
  }

  if (loading) {
    return <HistoricalDataSkeleton />
  }

  if (error && !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Historical Data & Analytics</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <Card className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Unable to Load Historical Data</h3>
            <p className="text-muted-foreground mb-4">{error || "No data available"}</p>
            <Button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? "Refreshing..." : "Try Again"}
            </Button>
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Historical Data & Analytics</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Show sample data warning if applicable */}
      {isSampleData && (
        <Alert>
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>Showing sample data. This is not real historical data for your location.</AlertDescription>
        </Alert>
      )}

      {/* Show error message if there is one, but we still have data */}
      {error && data && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add a note about the 5km radius */}
      <Alert>
        <AlertDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Showing historical disaster data within 5km of your current location
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart className="mr-2 h-5 w-5" />
              Disaster Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="h-48 bg-muted rounded-md p-4 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="pb-2">Year</th>
                    <th className="pb-2">Count</th>
                    <th className="pb-2">Primary Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.trends.map((trend: DisasterTrend, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="py-1">{trend.year}</td>
                      <td className="py-1">{trend.count}</td>
                      <td className="py-1">{trend.primaryType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <ul className="space-y-2 h-48 overflow-y-auto">
              {data?.events.map((event: DisasterEvent) => (
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
                  {event.distance && (
                    <div className="flex items-center text-xs mt-1 text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>
                        {event.location} ({event.distance})
                      </span>
                    </div>
                  )}
                </li>
              ))}
              {data?.events.length === 0 && (
                <li className="text-center py-4 text-muted-foreground">
                  No historical disaster events found within 5km
                </li>
              )}
            </ul>
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
                {data?.frequencyData.map((item: FrequencyDataItem, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.type}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(item.count / Math.max(...data.frequencyData.map((d: FrequencyDataItem) => d.count))) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
                {data?.frequencyData.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No frequency data available</div>
                )}
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Severity Distribution
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {data?.severityData.map((item: SeverityDataItem, index: number) => (
                  <div key={index} className="bg-background p-3 rounded-md text-center">
                    <div className="text-2xl font-bold">{item.count}</div>
                    <div
                      className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${getSeverityColor(item.severity)}`}
                    >
                      {item.severity}
                    </div>
                  </div>
                ))}
                {data?.severityData.length === 0 && (
                  <div className="col-span-2 text-center py-4 text-muted-foreground">No severity data available</div>
                )}
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Historical Data & Analytics</h2>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-48 w-full" />
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

