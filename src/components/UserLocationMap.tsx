"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

export function UserLocationMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState<string>("Loading location...")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })

          // Try to get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
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
          setError("Unable to retrieve your location. Please enable location services.")
          setLoading(false)
        },
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="h-48 md:h-64 rounded-lg flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-muted-foreground">Getting your location...</p>
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

  // Use OpenStreetMap for the map (no API key required)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01}%2C${
    location.lat - 0.01
  }%2C${location.lng + 0.01}%2C${location.lat + 0.01}&layer=mapnik&marker=${location.lat}%2C${location.lng}`

  return (
    <div className="h-48 md:h-64 rounded-lg overflow-hidden">
      <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
      <p className="text-sm mt-2">{locationName}</p>
    </div>
  )
}

