"use client"

import { GoogleMap, Marker } from "@react-google-maps/api"
import { useMemo } from "react"

const Map = ({ center, markers, onMarkerClick }: {
  center: { lat: number; lng: number }
  markers: Array<{ lat: number; lng: number; id: string }>
  onMarkerClick: (id: string) => void
}) => {
  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
  }), [])

  return (
    <GoogleMap
      options={mapOptions}
      zoom={13}
      center={center}
      mapContainerStyle={{ width: '100%', height: '100%' }}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => onMarkerClick(marker.id)}
        />
      ))}
    </GoogleMap>
  )
}

export default Map