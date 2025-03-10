"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Heart, RefreshCw, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { SafetyDialog } from "@/components/safety-dialog"
import { fetchDisasterSafetyData, type DisasterSafetyData } from "@/lib/actions/safety-actions"

// Define available disaster types
const DISASTER_TYPES = ["Flood", "Earthquake", "Wildfire", "Hurricane", "Tornado"] as const
type DisasterType = (typeof DISASTER_TYPES)[number]

export function SafetyGuidelines() {
  const [safetyData, setSafetyData] = useState<DisasterSafetyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSampleData, setIsSampleData] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDisasterType, setSelectedDisasterType] = useState<DisasterType>("Flood")

  const loadSafetyData = async () => {
    try {
      setRefreshing(true)
      setError(null)

      console.log(`Fetching safety data for disaster type: ${selectedDisasterType}`)
      const result = await fetchDisasterSafetyData(selectedDisasterType)

      if (result.success) {
        setSafetyData(result.data)
        setIsSampleData(true)
        console.log("Successfully loaded safety data")
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
    setLoading(true)
    loadSafetyData()
  }

  const handleDisasterTypeChange = (type: DisasterType) => {
    setSelectedDisasterType(type)
    setLoading(true)
  }

  useEffect(() => {
    loadSafetyData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDisasterType])

  if (loading) {
    return <SafetyDataSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Safety Guidelines</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={selectedDisasterType}
            onChange={(e) => handleDisasterTypeChange(e.target.value as DisasterType)}
            className="px-3 py-2 rounded-md border bg-background"
          >
            <option value="Flood">Flood</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Wildfire">Wildfire</option>
            <option value="Hurricane">Hurricane</option>
            <option value="Tornado">Tornado</option>
          </select>
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

      {/* Show error message if there is one */}
      {error && (
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
              {safetyData && safetyData.beforeDisaster.tips.length > 0 ? (
                <>
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">{safetyData.beforeDisaster.title}</h3>
                    <ul className="space-y-2">
                      {safetyData.beforeDisaster.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No preparedness information available</p>
                </div>
              )}
            </div>
            {safetyData && safetyData.beforeDisaster.tips.length > 0 && (
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
              {safetyData && safetyData.firstAid.tips.length > 0 ? (
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">{safetyData.firstAid.title}</h3>
                  <ul className="space-y-2">
                    {safetyData.firstAid.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <Heart className="h-4 w-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No first aid information available</p>
                </div>
              )}
              {safetyData && safetyData.firstAid.tips.length > 0 && (
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

