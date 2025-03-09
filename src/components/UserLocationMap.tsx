"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Compass, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { findMidAltitudePlaces } from "@/lib/actions/altitude-actions"
import { useAltitudePlaces } from "@/lib/stores/altitude-context-simple"

export function UserLocationMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState<string>("Determining your location...")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Use the context to update places
  const { setPlaces, setLoading: setLoadingPlaces } = useAltitudePlaces()

  const getLocation = () => {
    setLoading(true)
    setError(null)
    setLoadingPlaces(true)

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      // Use maximum accuracy settings
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords
          console.log(`Location accuracy: ${accuracy} meters`)

          setLocation({ lat: latitude, lng: longitude })
          setLocationName(`Your location (±${Math.round(accuracy)} meters)`)
          setLoading(false)

          // Fetch mid altitude places using the actual device coordinates
          await fetchMidAltitudePlaces(latitude, longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError(`Unable to access your location: ${error.message}. Please check your device settings.`)
          setLoading(false)
          setLoadingPlaces(false)
        },
        options,
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setLoading(false)
      setLoadingPlaces(false)
    }
  }

  const fetchMidAltitudePlaces = async (latitude: number, longitude: number) => {
    try {
      setLoadingPlaces(true)
      console.log(`Fetching mid altitude places for coordinates: ${latitude}, ${longitude}`)

      const result = await findMidAltitudePlaces(latitude, longitude)

      if (result.success) {
        console.log(`Found ${result.places.length} mid altitude places`)
        setPlaces(result.places)
      } else {
        console.error("Error fetching mid altitude places:", result.error)
      }
    } catch (error) {
      console.error("Error fetching mid altitude places:", error)
    } finally {
      setLoadingPlaces(false)
    }
  }

  // Open in device's native maps app
  const openInNativeMaps = () => {
    if (!location) return

    // This will open the native maps app on both iOS and Android
    const url = `geo:${location.lat},${location.lng}?q=${location.lat},${location.lng}`

    // For iOS, we need a different format
    const iosUrl = `maps:?q=${location.lat},${location.lng}`

    // Try to detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    // Try to open the appropriate URL
    window.location.href = isIOS ? iosUrl : url
  }

  // Open in Google Maps
  const openInGoogleMaps = () => {
    if (!location) return

    const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
    window.open(url, "_blank")
  }

  useEffect(() => {
    getLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Device Location
        </CardTitle>
        <CardDescription className="text-xs">{loading ? "Getting your location..." : locationName}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-muted-foreground">Accessing device location...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center justify-center">
                <Compass className="h-12 w-12 text-primary mb-2" />
              </div>
              <p className="text-center text-sm mb-1">Your coordinates:</p>
              <p className="text-center font-mono text-sm">
                {location?.lat.toFixed(6)}, {location?.lng.toFixed(6)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button className="flex items-center justify-center" onClick={openInNativeMaps} disabled={!location}>
                <Navigation className="h-4 w-4 mr-2" />
                Open Maps App
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={openInGoogleMaps}
                disabled={!location}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Maps
              </Button>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" onClick={getLocation} className="w-full text-xs" disabled={loading}>
          Refresh Location
        </Button>
      </CardFooter>
    </Card>
  )
}

