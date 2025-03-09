"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Stethoscope, AlertTriangle, RefreshCw, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { SafetyDialog } from "./safety-dialog"
import { fetchSafetyData, type DisasterSafetyData } from "@/lib/actions/safety-actions"

const DISASTER_TYPES = [
  { value: "flood", label: "Flood" },
  { value: "earthquake", label: "Earthquake" },
  { value: "hurricane", label: "Hurricane" },
  { value: "tornado", label: "Tornado" },
  { value: "wildfire", label: "Wildfire" },
  { value: "tsunami", label: "Tsunami" },
  { value: "drought", label: "Drought" },
  { value: "landslide", label: "Landslide" },
  { value: "blizzard", label: "Blizzard" },
]

export function SafetyGuidelines() {
  const [disasterType, setDisasterType] = useState<string>("flood")
  const [safetyData, setSafetyData] = useState<DisasterSafetyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSampleData, setIsSampleData] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadSafetyData = async () => {
    try {
      setRefreshing(true)

      console.log(`Fetching safety data for disaster type: ${disasterType}`)
      const result = await fetchSafetyData(disasterType)

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
    setDisasterType(value)
    setLoading(true)
  }

  useEffect(() => {
    loadSafetyData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disasterType])

  if (loading) {
    return <SafetyDataSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Safety Guidelines</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={disasterType} onValueChange={handleDisasterTypeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select disaster type" />
            </SelectTrigger>
            <SelectContent>
              {DISASTER_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
          <AlertDescription>Showing sample data. This is not comprehensive safety information.</AlertDescription>
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
            <CardTitle className="text-lg flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              {safetyData?.disasterType || "Disaster"} Preparedness
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="list-disc pl-5 mb-4 space-y-2 text-sm">
              {safetyData?.beforeTips.slice(0, 3).map((tip, index) => (
                <li key={index}>
                  <strong>{tip.title}:</strong> {tip.description}
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={() => setDialogOpen(true)}>
              Learn More
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="mr-2 h-5 w-5" />
              First Aid Basics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {safetyData?.firstAidTips.map((tip, index) => (
                <li key={index} className="flex items-start text-sm">
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>{tip.title}:</strong> {tip.description}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {safetyData && <SafetyDialog open={dialogOpen} onOpenChange={setDialogOpen} safetyData={safetyData} />}
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
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-full max-w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

