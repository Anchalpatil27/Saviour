"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Heart, RefreshCw, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { SafetyDialog } from "@/components/safety-dialog"
import { fetchDisasterSafetyData, type DisasterSafetyData } from "@/lib/actions/safety-actions"
import { Badge } from "@/components/ui/badge"

// Define available disaster types
type DisasterType = "Flood" | "Earthquake" | "Wildfire" | "Hurricane" | "Tornado"

// Define icon mapping for disaster types
const disasterIcons: Record<DisasterType, React.ReactNode> = {
  Flood: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 7L10 3L21 7M3 7V12L10 16M3 7L10 11M21 7V12L14 16M21 7L14 11M10 11V16M10 16L14 16M14 11V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Earthquake: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 9L8 3M22 9L16 3M2 15L8 21M22 15L16 21M12 2V6M12 18V22M4 12H8M16 12H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Wildfire: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C8 7 6 11 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 11 16 7 12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Hurricane: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 3C7.5 3 5 8 5 8M12 21C7.5 21 5 16 5 16M12 3C16.5 3 19 8 19 8M12 21C16.5 21 19 16 19 16"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  Tornado: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 4H3M19 8H5M17 12H7M15 16H9M13 20H11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

export function SafetyGuidelines() {
  const [safetyData, setSafetyData] = useState<DisasterSafetyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDisasterType, setSelectedDisasterType] = useState<DisasterType>("Flood")
  const [usingFallbackData, setUsingFallbackData] = useState(false)

  const loadSafetyData = async () => {
    try {
      setRefreshing(true)
      setError(null)
      setUsingFallbackData(false) // Reset fallback data state

      console.log(`Fetching safety data for disaster type: ${selectedDisasterType}`)
      const result = await fetchDisasterSafetyData(selectedDisasterType)

      if (result.success) {
        setSafetyData(result.data)
        console.log("Successfully loaded safety data")

        // Check if we're using fallback data
        if (result.error && result.error.includes("fallback data")) {
          setUsingFallbackData(true)
        }
      } else {
        console.error("Error from safety data action:", result.error)
        setError(result.error || "Failed to fetch safety data")
        setUsingFallbackData(true) // Assume fallback data is being used

        // Still set the data even if there was an error
        if (result.data) {
          setSafetyData(result.data)
        }
      }
    } catch (err) {
      console.error("Error loading safety data:", err)
      setError("An unexpected error occurred while fetching safety data")
      setUsingFallbackData(true) // Assume fallback data is being used
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          {disasterIcons[selectedDisasterType]}
          <span className="ml-2">{selectedDisasterType} Safety Guidelines</span>
        </h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {["Flood", "Earthquake", "Wildfire", "Hurricane", "Tornado"].map((type) => (
            <Badge
              key={type}
              variant={selectedDisasterType === type ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => handleDisasterTypeChange(type as DisasterType)}
            >
              {type}
            </Badge>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1 ml-auto"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Show error message if there is one */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add this new Alert for fallback data */}
      {usingFallbackData && !error && (
        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 mb-4">
          <Info className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            Using reliable locally-stored safety data. This information is comprehensive but not location-specific.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Shield className="mr-2 h-5 w-5" />
              Before & During
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pt-0">
            {safetyData && (
              <div className="space-y-4">
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3 border border-amber-100 dark:border-amber-900">
                  <h3 className="font-medium mb-2 flex items-center text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {safetyData.beforeDisaster.title}
                  </h3>
                  <ul className="grid gap-1.5">
                    {safetyData.beforeDisaster.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="inline-flex items-center justify-center rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 h-5 w-5 text-xs mr-2 shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-100 dark:border-blue-900">
                  <h3 className="font-medium mb-2 flex items-center text-blue-800 dark:text-blue-300">
                    <Shield className="h-4 w-4 mr-2" />
                    {safetyData.duringDisaster.title}
                  </h3>
                  <ul className="grid gap-1.5">
                    {safetyData.duringDisaster.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 h-5 w-5 text-xs mr-2 shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <Button className="w-full mt-4" onClick={() => setDialogOpen(true)} variant="outline">
              View Complete Safety Guide
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <div className="flex justify-between w-full">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  After & First Aid
                </div>
                <Badge variant="outline" className="ml-auto">
                  Essential
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pt-0">
            {safetyData && (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-3 border border-green-100 dark:border-green-900">
                  <h3 className="font-medium mb-2 flex items-center text-green-800 dark:text-green-300">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {safetyData.afterDisaster.title}
                  </h3>
                  <ul className="grid gap-1.5">
                    {safetyData.afterDisaster.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="inline-flex items-center justify-center rounded-full bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 h-5 w-5 text-xs mr-2 shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3 border border-red-100 dark:border-red-900">
                  <h3 className="font-medium mb-2 flex items-center text-red-800 dark:text-red-300">
                    <Heart className="h-4 w-4 mr-2" />
                    {safetyData.firstAid.title}
                  </h3>
                  <ul className="grid gap-1.5">
                    {safetyData.firstAid.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="inline-flex items-center justify-center rounded-full bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 h-5 w-5 text-xs mr-2 shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <Alert className="mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 text-sm">
              <Info className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                These guidelines can help save lives during critical situations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {safetyData && (
        <SafetyDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          safetyData={safetyData}
          disasterType={selectedDisasterType}
          usingFallbackData={usingFallbackData}
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
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
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
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

