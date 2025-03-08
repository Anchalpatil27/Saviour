"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

// Dynamically import Leaflet components with no SSR to avoid hydration issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
import { useMap } from "react-leaflet"

// Component to handle recenter functionality
function RecenterAutomatically({ position }: { position: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(position, map.getZoom())
  }, [position, map])

  return null
}

// Component to handle location button
function LocationButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      className="absolute bottom-4 right-4 z-[1000] bg-white text-black hover:bg-gray-100 shadow-md"
    >
      <Locate className="h-4 w-4 mr-1" />
      Recenter
    </Button>
  )
}

export function UserLocationMap() {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [locationName, setLocationName] = useState<string>("Loading location...")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [highAccuracy, setHighAccuracy] = useState(true)
  const mapRef = useRef(null)

  const getLocation = () => {
    setLoading(true)

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords
          console.log(`Location accuracy: ${accuracy} meters`)

          setPosition([latitude, longitude])

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
            setHighAccuracy(false)
            getLocation()
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

  useEffect(() => {
    // Add Leaflet CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    link.crossOrigin = ""
    document.head.appendChild(link)

    getLocation()

    return () => {
      document.head.removeChild(link)
    }
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
          <Button onClick={getLocation} size="sm" className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!position) {
    return (
      <div className="h-48 md:h-64 rounded-lg flex items-center justify-center bg-gray-100">
        <MapPin className="h-8 w-8 text-gray-400" />
        <span className="ml-2 text-gray-600">Location not available</span>
      </div>
    )
  }

  return (
    <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
      {typeof window !== "undefined" && (
        <>
          <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }} ref={mapRef}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                Your location
                <br />
                {locationName}
              </Popup>
            </Marker>
            <RecenterAutomatically position={position} />
          </MapContainer>
          <LocationButton onClick={getLocation} />
        </>
      )}
      <p className="text-xs text-muted-foreground mt-1 px-2">{locationName}</p>
    </div>
  )
}

