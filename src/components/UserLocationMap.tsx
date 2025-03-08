"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, ExternalLink, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function UserLocationMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState<string>("Determining your location...")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const getLocation = (highAccuracy = true) => {
    setLoading(true)
    setError(null)

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords
          console.log(`Location accuracy: ${accuracy} meters`)

          setLocation({ lat: latitude, lng: longitude })

          // Try to get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { "User-Agent": "CityChat Community App" } },
            )
            const data = await response.json()
            if (data && data.display_name) {
              setLocationName(data.display_name)
            }
          } catch (e) {
            console.error("Error getting location name:", e)
            setLocationName("Current Location")
          }

          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)

          // If high accuracy fails, try again with low accuracy
          if (highAccuracy) {
            getLocation(false)
            return
          }

          setError(`Unable to retrieve your location: ${error.message}. Please enable location services.`)
          setLoading(false)
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
    }
  }

  // Open in Google Maps
  const openInGoogleMaps = () => {
    if (!location) return

    const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
    window.open(url, "_blank")
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

    window.location.href = isIOS ? iosUrl : url
  }

  // Open in Waze
  const openInWaze = () => {
    if (!location) return

    const url = `https://waze.com/ul?ll=${location.lat},${location.lng}&navigate=yes`
    window.open(url, "_blank")
  }

  useEffect(() => {
    getLocation()
  }, [])

  if (loading) {
    return (
      <div className="h-48 md:h-64 rounded-lg overflow-hidden">
        <Skeleton className="h-full w-full" />
        <div className="flex justify-center items-center absolute inset-0">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-muted-foreground">Getting your location...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-48 md:h-64 rounded-lg flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center text-center px-4">
          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => getLocation(true)} size="sm" className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="h-48 md:h-64 rounded-lg flex items-center justify-center bg-gray-100">
        <MapPin className="h-8 w-8 text-gray-400" />
        <span className="ml-2 text-gray-600">Location not available</span>
      </div>
    )
  }

  // Create a static map image URL from OpenStreetMap
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${location.lat},${location.lng}&zoom=15&size=600x400&markers=${location.lat},${location.lng},red`

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Your Location
        </CardTitle>
        <CardDescription className="text-xs truncate">{locationName}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-40 md:h-48 overflow-hidden">
          <img src={staticMapUrl || "/placeholder.svg"} alt="Your location" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={() => getLocation(true)}
                  >
                    <Navigation className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh location</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-2">
        <div className="text-xs text-muted-foreground">
          Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={openInGoogleMaps}>
                  <Map className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in Google Maps</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={openInNativeMaps}>
                  <Navigation className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in Maps App</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={openInWaze}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in Waze</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  )
}

