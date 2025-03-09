"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mountain, Navigation, Map, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { HighAltitudePlace } from "@/lib/actions/altitude-actions"

interface HighAltitudePlacesProps {
  places: HighAltitudePlace[]
  isLoading: boolean
}

export function HighAltitudePlaces({ places, isLoading }: HighAltitudePlacesProps) {
  const [selectedPlace, setSelectedPlace] = useState<HighAltitudePlace | null>(null)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "High":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const navigateToPlace = (place: HighAltitudePlace, app: "google" | "native" | "waze") => {
    const { lat, lng } = place.coordinates

    if (app === "google") {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")
    } else if (app === "waze") {
      window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, "_blank")
    } else {
      // Native maps app
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const url = isIOS ? `maps:?daddr=${lat},${lng}` : `geo:0,0?q=${lat},${lng}(${encodeURIComponent(place.name)})`

      window.location.href = url
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mountain className="mr-2 h-5 w-5" />
            High Altitude Places
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 border-b pb-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (places.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mountain className="mr-2 h-5 w-5" />
            High Altitude Places
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Mountain className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No high altitude places found nearby.</p>
            <p className="text-sm text-muted-foreground">Try searching in a different location.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mountain className="mr-2 h-5 w-5" />
          High Altitude Places Nearby
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {places.map((place) => (
            <div key={place.name} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{place.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2">{place.elevation}</span>
                    <span>•</span>
                    <span className="ml-2">{place.distanceFromUser}</span>
                  </div>
                </div>
                <Badge className={getRiskColor(place.risk)}>{place.risk}</Badge>
              </div>

              <p className="text-sm mb-3">{place.description}</p>

              {selectedPlace?.name === place.name ? (
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center justify-center"
                    onClick={() => navigateToPlace(place, "google")}
                  >
                    <Map className="h-3.5 w-3.5 mr-1" />
                    Google
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center justify-center"
                    onClick={() => navigateToPlace(place, "native")}
                  >
                    <Navigation className="h-3.5 w-3.5 mr-1" />
                    Maps
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center justify-center"
                    onClick={() => navigateToPlace(place, "waze")}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Waze
                  </Button>
                  <Button size="sm" variant="ghost" className="col-span-3 mt-1" onClick={() => setSelectedPlace(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => setSelectedPlace(place)} className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

