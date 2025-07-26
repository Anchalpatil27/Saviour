"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Sun, CloudRain, Wind, Droplet, Sunrise, Sunset, Thermometer, Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase"
import Image from "next/image"
import { useIsClient } from "usehooks-ts"

const OPEN_WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY

type WeatherData = {
  current: any
  hourly: any[]
  daily: any[]
}

function getWeatherGradient(main: string) {
  if (!main) return "bg-gradient-to-br from-indigo-200 to-indigo-400"
  main = main.toLowerCase()
  if (main.includes("rain")) return "bg-gradient-to-br from-blue-400 to-blue-700"
  if (main.includes("cloud")) return "bg-gradient-to-br from-gray-300 to-gray-500"
  if (main.includes("sun") || main.includes("clear")) return "bg-gradient-to-br from-yellow-200 to-yellow-400"
  return "bg-gradient-to-br from-indigo-200 to-indigo-400"
}

function getWindDirection(deg: number) {
  const dirs = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ]
  return dirs[Math.round(deg / 22.5) % 16]
}

function getUVLevel(uvi: number) {
  if (uvi <= 2) return { level: "Low", color: "text-green-600" }
  if (uvi <= 5) return { level: "Moderate", color: "text-yellow-600" }
  if (uvi <= 7) return { level: "High", color: "text-orange-600" }
  if (uvi <= 10) return { level: "Very High", color: "text-red-600" }
  return { level: "Extreme", color: "text-purple-600" }
}

function formatTime(ts: number) {
  return new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
}

export default function WeatherPage() {
  const isClient = useIsClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [place, setPlace] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Auth check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/auth/login")
    })
    return () => unsubscribe()
  }, [router])

  // Fetch location
  const fetchCoords = useCallback(async () => {
    setError(null)
    setPlace(null)
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported.")
      setCoords(null)
      return
    }
    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            setCoords({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            })
            // Reverse geocode
            try {
              const resp = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
              )
              const data = await resp.json()
              setPlace(
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                data.address?.state ||
                data.address?.country ||
                "Unknown"
              )
            } catch {
              setPlace("Unknown")
            }
            resolve()
          },
          () => {
            setError("Location permission denied.")
            setCoords(null)
            setPlace(null)
            resolve()
          },
          { enableHighAccuracy: true }
        )
      })
    } catch {
      setError("Failed to fetch device location.")
      setCoords(null)
      setPlace(null)
    }
  }, [])

  // Fetch weather
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)
    try {
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${OPEN_WEATHER_API_KEY}`
      const resp = await fetch(url)
      if (!resp.ok) throw new Error("Weather API error")
      const data = await resp.json()
      setWeather(data)
      setError(null)
    } catch {
      setWeather(null)
      setError("Failed to fetch weather data.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    setWeather(null)
    setCoords(null)
    setPlace(null)
    await fetchCoords()
  }, [fetchCoords])

  useEffect(() => {
    if (isClient) {
      loadAll()
    }
  }, [isClient, loadAll])

  useEffect(() => {
    if (coords && typeof coords.latitude === "number" && typeof coords.longitude === "number") {
      fetchWeather(coords.latitude, coords.longitude)
    }
  }, [coords, fetchWeather])

  const onRefresh = async () => {
    setRefreshing(true)
    setError(null)
    await loadAll()
    setRefreshing(false)
  }

  // Loading UI
  if (!isClient || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Progress value={70} className="w-1/2 mb-4" />
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <span className="text-lg text-indigo-700">Loading Weather Data...</span>
      </div>
    )
  }

  // Error UI
  if (error || !coords) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-red-500 text-lg mb-2">{error || "No coordinates found."}</span>
        <Button onClick={onRefresh} className="mt-2">Refresh</Button>
      </div>
    )
  }

  // Defensive check for weather data
  if (!weather || !weather.current || !weather.hourly || !weather.daily) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-red-500 text-lg mb-2">
          Weather data not available. Please refresh.
        </span>
        <Button onClick={onRefresh} className="mt-2">Refresh</Button>
      </div>
    )
  }

  // Main UI
  const gradientClass = getWeatherGradient(weather.current.weather[0].main)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        <Card className={`mb-8 shadow-lg overflow-hidden ${gradientClass}`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Weather Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                  <span className="font-semibold text-white">{place || "Fetching location..."}</span>
                </div>
                <div className="text-white text-sm mb-2">
                  Lat: {coords.latitude.toFixed(4)}, Lon: {coords.longitude.toFixed(4)}
                </div>
                <div className="text-5xl font-bold text-white mb-2">
                  {Math.round(weather.current.temp)}°C
                </div>
                <div className="text-lg text-white font-semibold capitalize mb-2">
                  {weather.current.weather[0].description}
                </div>
                <div className="text-white mb-2">
                  Feels like {Math.round(weather.current.feels_like)}°C
                </div>
                <div className="flex gap-4 text-white mb-2">
                  <div className="flex items-center gap-1">
                    <Wind className="w-4 h-4" />
                    {Math.round(weather.current.wind_speed)} m/s {getWindDirection(weather.current.wind_deg)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplet className="w-4 h-4" />
                    {weather.current.humidity}%
                  </div>
                  <div className="flex items-center gap-1">
                    <Sun className="w-4 h-4" />
                    {weather.current.uvi !== undefined
                      ? <span className={getUVLevel(weather.current.uvi).color}>
                          {Math.round(weather.current.uvi)} ({getUVLevel(weather.current.uvi).level})
                        </span>
                      : "N/A"}
                  </div>
                </div>
                <div className="flex gap-4 text-white">
                  <div className="flex items-center gap-1">
                    <Sunrise className="w-4 h-4" />
                    {formatTime(weather.current.sunrise)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Sunset className="w-4 h-4" />
                    {formatTime(weather.current.sunset)}
                  </div>
                </div>
              </div>
              <div className="relative w-32 h-32">
                <Image
                  src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@4x.png`}
                  alt={`${weather.current.weather[0].description} icon`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Forecast */}
        <Card className="mb-8 shadow">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Next 24 Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto gap-4 pb-2">
              {weather.hourly.slice(0, 24).map((hour: any, idx: number) => (
                <div key={idx} className="min-w-[80px] flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow">
                  <div className="text-xs text-gray-500">{idx === 0 ? "Now" : formatTime(hour.dt)}</div>
                  <div className="relative w-10 h-10">
                    <Image
                      src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                      alt={`${hour.weather[0].description} icon`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="font-bold text-lg">{Math.round(hour.temp)}°</div>
                  {hour.pop > 0 && (
                    <div className="flex items-center gap-1 text-blue-500 text-xs">
                      <CloudRain className="w-4 h-4" />
                      {Math.round(hour.pop * 100)}%
                    </div>
                  )}
                  {hour.rain && hour.rain["1h"] && (
                    <div className="text-blue-500 text-xs">Rain: {hour.rain["1h"]} mm</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Forecast */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-xl font-bold">7-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weather.daily.slice(0, 7).map((day: any, idx: number) => {
                const uv = getUVLevel(day.uvi)
                return (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                    <div className="relative w-12 h-12">
                      <Image
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt={`${day.weather[0].description} icon`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{formatDate(day.dt)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">{day.weather[0].description}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-500 text-xs">{Math.round(day.pop * 100)}%</span>
                        <span className="font-bold text-lg">{Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°</span>
                      </div>
                      {day.rain && (
                        <div className="text-blue-500 text-xs">Rain: {day.rain} mm</div>
                      )}
                      {day.snow && (
                        <div className="text-blue-300 text-xs">Snow: {day.snow} mm</div>
                      )}
                      <div className={`text-xs mt-1 ${uv.color}`}>UV: {day.uvi} ({uv.level})</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}