"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Stethoscope, AlertTriangle, RefreshCw, Info } from 'lucide-react'
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
            <p className="text-sm text-muted-foreground mb-4">
              Learn essential safety measures and preparedness tips for {safetyData?.disasterType || "disaster"}{" "}
              situations. This guide covers what to do before, during, and after the event to protect yourself and your
              loved ones.
            </p>
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
              Complete First Aid Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive first aid information for {safetyData?.disasterType || "disaster"} emergencies. 
              These guidelines can help save lives during critical situations.
            </p>
            <div className="space-y-6">
              {safetyData?.firstAidTips.map((tip, index) => (
                <div key={index} className="border-b pb-5 last:border-0">
                  <div className="flex items-start mb-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full mr-3">
                      <Stethoscope className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <h4 className="font-medium text-base">{tip.title}</h4>
                  </div>
                  <div className="ml-9 space-y-2">
                    <p className="text-sm">{tip.description}</p>
                    
                    {/* Additional detailed steps - this would ideally come from the API but we're adding it for demonstration */}
                    <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                      <h5 className="text-xs font-medium uppercase text-muted-foreground mb-2">Step-by-step guide:</h5>
                      <ol className="list-decimal list-inside text-xs space-y-1.5">
                        {[1, 2, 3].map((step) => (
                          <li key={step} className="text-muted-foreground">
                            {tip.title.includes("CPR") ? 
                              [`Check responsiveness and call for help`, `Begin chest compressions at 100-120 per minute`, `Continue until help arrives`][step-1] :
                            tip.title.includes("bleeding") || tip.title.includes("wound") ? 
                              [`Apply direct pressure with clean cloth`, `Elevate the injured area if possible`, `Apply bandage when bleeding slows`][step-1] :
                            tip.title.includes("burn") ? 
                              [`Cool the burn with cool running water`, `Cover with clean, dry bandage`, `Do not apply creams or ointments initially`][step-1] :
                            tip.title.includes("fracture") || tip.title.includes("broken") ? 
                              [`Immobilize the injured area`, `Apply cold pack to reduce swelling`, `Seek medical attention immediately`][step-1] :
                              [`Assess the situation and ensure safety`, `Provide appropriate care based on symptoms`, `Monitor and seek medical help if needed`][step-1]}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {safetyData?.firstAidTips.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p>No specific first aid information available for this disaster type.</p>
              </div>
            )}
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
