"use client"

import { useState, useEffect } from "react"
import { HistoricalDataDisplay } from "./historical-data-display"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LocationBasedHistoricalData() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const getLocation = () => {
    setLoading(true)
    setError(null)

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCoordinates({ lat: latitude, lng: longitude })
          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError(`Unable to access your location: ${error.message}. Please check your device settings.`)
          setLoading(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setLoading(false)
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

  return <HistoricalDataDisplay coordinates={coordinates} />
}

