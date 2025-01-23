import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [coords, setCoords] = useState<{latitude: number | null, longitude: number | null}>({
    latitude: null,
    longitude: null,
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLoading(false)
        },
        (error) => {
          setError("Error getting geolocation: " + error.message)
          setLoading(false)
        }
      )
    } else {
      setError("Geolocation is not available in this browser.")
      setLoading(false)
    }
  }, [])

  return { ...coords, error, loading }
}