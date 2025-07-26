"use client"

import { useState, useEffect } from "react"
import { HistoricalDataDisplay } from "./historical-data-display"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LocationBasedHistoricalData() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getLocation = () => {
    setIsLoading(true)
    setError(null)

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCoordinates({ lat: latitude, lng: longitude })
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          const message =
            error && typeof error.message === "string" && error.message.length > 0
              ? error.message
              : "Unknown error or permission denied."
          setError(`Unable to access your location: ${message} Please check your device settings and allow location access.`)
          setIsLoading(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getLocation()
  }, [])

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={getLocation}>Try Again</Button>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading location data...</div>
  }

  return <HistoricalDataDisplay coordinates={coordinates} />
}