"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mountain, Navigation, Map, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAltitudePlacesStore } from "@/lib/stores/altitude-store"

export function HighAltitudeTable() {
  const { places, loading, selectedPlace, setSelectedPlace } = useAltitudePlacesStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "secondary"
      case "Medium":
        return "default"
      case "High":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const navigateToPlace = (app: "google" | "native" | "waze") => {
    if (!selectedPlace) return

    const { lat, lng } = selectedPlace.coordinates

    if (app === "google") {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")
    } else if (app === "waze") {
      window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, "_blank")
    } else {
      // Native maps app
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const url = isIOS
        ? `maps:?daddr=${lat},${lng}`
        : `geo:0,0?q=${lat},${lng}(${encodeURIComponent(selectedPlace.name)})`

      window.location.href = url
    }

    setDialogOpen(false)
  }

  const handleDetailsClick = (place: (typeof places)[0]) => {
    setSelectedPlace(place)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Mountain className="mr-2 h-5 w-5" />
            High Altitudes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Elevation</th>
                  <th className="pb-2">Risk</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-2">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="py-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="py-2">
                      <Skeleton className="h-8 w-16 rounded-md" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (places.length === 0) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Mountain className="mr-2 h-5 w-5" />
            High Altitudes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
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
    <>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Mountain className="mr-2 h-5 w-5" />
            High Altitudes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Elevation</th>
                  <th className="pb-2">Risk</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place: typeof places[0]) => (
                  <tr key={place.id} className="border-t">
                    <td className="py-2">{place.name}</td>
                    <td className="py-2">{place.elevation}</td>
                    <td className="py-2">
                      <Badge variant={getRiskColor(place.risk)}>{place.risk}</Badge>
                    </td>
                    <td className="py-2">
                      <Button size="sm" onClick={() => handleDetailsClick(place)}>
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPlace?.name}</DialogTitle>
            <DialogDescription>{selectedPlace?.description}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-sm">
                <span className="font-medium">Elevation:</span> {selectedPlace?.elevation}
              </div>
              <div className="text-sm">
                <span className="font-medium">Distance:</span> {selectedPlace?.distanceFromUser}
              </div>
              <div className="text-sm">
                <span className="font-medium">Status:</span> {selectedPlace?.status}
              </div>
              <div className="text-sm">
                <span className="font-medium">Risk Level:</span> {selectedPlace?.risk}
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md text-sm mb-4">
              <p className="font-medium mb-1">Coordinates:</p>
              <p className="font-mono">
                {selectedPlace?.coordinates.lat.toFixed(6)}, {selectedPlace?.coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={() => navigateToPlace("google")} className="flex-1 flex items-center justify-center">
              <Map className="h-4 w-4 mr-2" />
              Google Maps
            </Button>
            <Button onClick={() => navigateToPlace("native")} className="flex-1 flex items-center justify-center">
              <Navigation className="h-4 w-4 mr-2" />
              Maps App
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateToPlace("waze")}
              className="flex-1 flex items-center justify-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Waze
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

