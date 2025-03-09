"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Heart, RefreshCw, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { SafetyDialog } from "@/components/safety-dialog"
import { fetchDisasterSafetyData, type DisasterSafetyData } from "@/lib/actions/safety-actions"

export function SafetyGuidelines() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [safetyData, setSafetyData] = useState<DisasterSafetyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSampleData, setIsSampleData] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
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
    try {
      setRefreshing(true)

      console.log(`Fetching safety data for disaster type: ${selectedDisasterType}`)
      const result = await fetchDisasterSafetyData(selectedDisasterType)

      if (result.success) {
        setSafetyData(result.data)
        setIsSampleData(true) // Since fetchDisasterSafetyData always returns sample data for now
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

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    loadSafetyData()
  }, [selectedDisasterType])

  if (loading) {
    return <SafetyDataSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Safety Guidelines</h2>
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
              {safetyData && (
                <>
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">{safetyData.beforeDisaster.title}</h3>
                    <ul className="space-y-2">
                      {safetyData.beforeDisaster.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              {!safetyData && (
                <div className="text-center py-6">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No preparedness information available</p>
                </div>
              )}
            </div>
            {safetyData && (
              <Button className="w-full mt-4" onClick={() => setDialogOpen(true)}>
                Learn More
              </Button>
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
              {safetyData && (
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">{safetyData.firstAid.title}</h3>
                  <ul className="space-y-2">
                    {safetyData.firstAid.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Heart className="h-4 w-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!safetyData || safetyData.firstAid.tips.length === 0 ? (
                <div className="text-center py-6">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No first aid information available</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-4">
                  These guidelines can help save lives during critical situations.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {safetyData && (
        <SafetyDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          safetyData={safetyData}
          disasterType={selectedDisasterType}
        />
      )}
    </div>
  )
}

function SafetyDataSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Safety Guidelines</h2>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

