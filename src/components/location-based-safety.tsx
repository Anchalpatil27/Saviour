"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Heart, RefreshCw, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchSafetyData, type SafetyData } from "@/lib/actions/safety-actions"

export function LocationBasedSafety() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [safetyData, setSafetyData] = useState<SafetyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSampleData, setIsSampleData] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDisasterType, setSelectedDisasterType] = useState<string>("Flood")

  const getLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log(`Got coordinates: ${latitude}, ${longitude}`)
          setCoordinates({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Use a default location if geolocation fails
          console.log("Using default coordinates")
          setCoordinates({ lat: 40.7128, lng: -74.006 }) // New York City coordinates
          setError(`Using default location. Original error: ${error.message}`)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      console.error("Geolocation not supported")
      // Use a default location if geolocation is not supported
      setCoordinates({ lat: 40.7128, lng: -74.006 }) // New York City coordinates
      setError("Geolocation is not supported by your browser. Using default location.")
    }
  }

  const loadSafetyData = async () => {
    if (!coordinates) return

    try {
      setRefreshing(true)

      console.log(`Fetching safety data for coordinates: ${coordinates.lat}, ${coordinates.lng}`)
      const result = await fetchSafetyData(coordinates.lat, coordinates.lng, selectedDisasterType)

      if (result.success) {
        setSafetyData(result.data)
        setIsSampleData(!!result.data.isSampleData)
        console.log("Successfully loaded safety data")

        if (result.error) {
          setError(result.error)
        } else {
          setError(null)
        }
      } else {
        console.error("Error from safety data action:", result.error)
        setError(result.error || "Failed to fetch safety data")
      }
    } catch (err) {
      console.error("Error loading safety data:", err)
      setError("An unexpected error occurred while fetching safety data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadSafetyData()
  }

  const handleDisasterTypeChange = (value: string) => {
    setSelectedDisasterType(value)
    setLoading(true)
  }

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    if (coordinates) {
      loadSafetyData()
    }
  }, [coordinates, selectedDisasterType])

  if (loading) {
    return <SafetyDataSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Safety Guidelines</h2>
        <div className="flex gap-2">
          <Select value={selectedDisasterType} onValueChange={handleDisasterTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select disaster type" />
            </SelectTrigger>
            <SelectContent>
              {safetyData?.availableDisasterTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing} title="Refresh data">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Show sample data warning if applicable */}
      {isSampleData && (
        <Alert>
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>
            Showing sample safety data. This is not location-specific safety information.
          </AlertDescription>
        </Alert>
      )}

      {/* Show error message if there is one, but we still have data */}
      {error && safetyData && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="mr-2 h-5 w-5" />
              Disaster Preparedness
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              {safetyData?.disasterPreparedness.map((item) => (
                <div key={item.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-sm">{item.content}</p>
                </div>
              ))}
              {(!safetyData?.disasterPreparedness || safetyData.disasterPreparedness.length === 0) && (
                <div className="text-center py-6">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No preparedness information available</p>
                </div>
              )}
            </div>
            {safetyData?.disasterPreparedness && safetyData.disasterPreparedness.length > 0 && (
              <Button className="w-full mt-4">Learn More</Button>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Heart className="mr-2 h-5 w-5" />
              Complete First Aid Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              {safetyData?.firstAidGuide.map((item) => (
                <div key={item.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
              ))}
              {(!safetyData?.firstAidGuide || safetyData.firstAidGuide.length === 0) && (
                <div className="text-center py-6">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No first aid information available</p>
                </div>
              )}
            </div>
            {safetyData?.firstAidGuide && safetyData.firstAidGuide.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                These guidelines can help save lives during critical situations.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SafetyDataSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Safety Guidelines</h2>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j}>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

