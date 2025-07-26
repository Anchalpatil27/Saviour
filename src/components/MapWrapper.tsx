import { useRef, useEffect } from "react"
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "500px",
}

export default function MapWrapper({ center, markers, onMarkerClick }) {
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRefs = useRef<google.maps.marker.AdvancedMarkerElement[]>([])

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
    libraries: ["marker"], // Required for AdvancedMarkerElement
  })

  // Add AdvancedMarkerElements when map and API are loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps?.marker?.AdvancedMarkerElement) return

    // Remove old markers
    markerRefs.current.forEach(marker => marker.map = null)
    markerRefs.current = []

    // Add new markers
    markers.forEach(markerData => {
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current!,
        position: { lat: markerData.lat, lng: markerData.lng },
        title: markerData.label,
      })
      marker.addListener("click", () => onMarkerClick(markerData.id))
      markerRefs.current.push(marker)
    })

    // Cleanup on unmount
    return () => {
      markerRefs.current.forEach(marker => marker.map = null)
      markerRefs.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, markers])

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading...</div>

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={map => {
        mapRef.current = map
      }}
      options={{
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
      }}
    />
  )
}