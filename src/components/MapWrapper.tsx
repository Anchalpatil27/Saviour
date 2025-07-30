import { useRef, useState } from "react"
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "500px",
}

export default function MapWrapper({ center, markers, onMarkerClick }) {
  const mapRef = useRef(null)
  const [activeMarker, setActiveMarker] = useState(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: [],
  })

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
      onClick={() => setActiveMarker(null)}
      options={{
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
      }}
    >
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.label}
          icon={marker.iconUrl || undefined}
          label={marker.urgency ? { text: marker.urgency, color: marker.urgency === 'High' ? '#ef4444' : marker.urgency === 'Medium' ? '#fbbf24' : '#3b82f6', fontWeight: 'bold', fontSize: '14px' } : undefined}
          onClick={() => {
            setActiveMarker(marker.id === activeMarker ? null : marker.id)
            if (onMarkerClick) onMarkerClick(marker.id)
          }}
        >
          {activeMarker === marker.id && (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{marker.label}</div>
                {marker.urgency && (
                  <div style={{ color: marker.urgency === 'High' ? '#ef4444' : marker.urgency === 'Medium' ? '#fbbf24' : '#3b82f6', fontWeight: 'bold' }}>{marker.urgency}</div>
                )}
                {marker.info && <div style={{ marginTop: 4 }}>{marker.info}</div>}
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  )
}