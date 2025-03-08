"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Compass,
  AlertTriangle,
  MapPin,
  Loader2,
  Search,
  Umbrella,
} from "lucide-react"

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || ""
if (!API_KEY) {
  console.error("OpenWeatherMap API key is missing. Please check your .env.local file.")
}

const BASE_URL = "https://api.openweathermap.org/data/2.5"

interface WeatherData {
  current: {
    name: string
    main: {
      temp: number
      humidity: number
    }
    wind: {
      speed: number
      deg: number
    }
    weather: Array<{
      icon: string
      description: string
    }>
  }
  forecast: Array<{
    dt: number
    main: {
      temp: number
    }
    weather: Array<{
      icon: string
      description: string
    }>
    pop: number
  }>
  alerts: Array<{
    event: string
    start: number
    end: number
  }>
}

async function getWeatherData(city: string): Promise<WeatherData> {
  try {
    const currentWeatherResponse = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`)
    if (!currentWeatherResponse.ok) {
      throw new Error(`Weather API error: ${currentWeatherResponse.status} ${currentWeatherResponse.statusText}`)
    }
    const currentWeatherData = await currentWeatherResponse.json()

    const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}`)
    }
    const forecastData = await forecastResponse.json()

    // Process forecast data to get daily forecasts
    const dailyForecasts = forecastData.list.filter((_: unknown, index: number) => index % 8 === 0).slice(0, 4)

    // Fetch alerts (Note: This API endpoint might not be available in all regions or API plans)
    const alertsResponse = await fetch(
      `${BASE_URL}/onecall?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&exclude=current,minutely,hourly,daily&appid=${API_KEY}`,
    )
    if (!alertsResponse.ok) {
      console.warn(`Alerts API error: ${alertsResponse.status} ${alertsResponse.statusText}`)
      // Continue without alerts if this endpoint fails
    }
    const alertsData = await alertsResponse.json()

    return {
      current: currentWeatherData,
      forecast: dailyForecasts,
      alerts: alertsData.alerts || [],
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

export default function WeatherPage() {
  const { status } = useSession()
  const router = useRouter()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<string>("")

  const fetchUserCity = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cities")
      if (!response.ok) {
        throw new Error("Failed to fetch user city")
      }
      const data = await response.json()
      if (data.city) {
        setLocation(data.city)
        await fetchWeatherData(data.city)
      } else {
        setError("City not set in your profile. Please enter a location manually.")
      }
    } catch (err) {
      console.error("Error fetching user city:", err)
      setError("Failed to fetch your city. Please enter a location manually.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserCity()
    }
  }, [status, fetchUserCity])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  const fetchWeatherData = async (city: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getWeatherData(city)
      setWeatherData(data)
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to fetch weather data. Please check the city name and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      fetchWeatherData(location)
    }
  }

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case "01d":
      case "01n":
        return Sun
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return Cloud
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        return CloudRain
      case "11d":
      case "11n":
        return AlertTriangle
      default:
        return Cloud
    }
  }

  const getPrecipitationDescription = (pop: number) => {
    if (pop < 0.2) return "Low chance of precipitation"
    if (pop < 0.5) return "Moderate chance of precipitation"
    if (pop < 0.8) return "High chance of precipitation"
    return "Very high chance of precipitation"
  }

  const getPrecipitationColor = (pop: number) => {
    if (pop < 0.2) return "bg-green-500"
    if (pop < 0.5) return "bg-yellow-500"
    if (pop < 0.8) return "bg-orange-500"
    return "bg-red-500"
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Weather Forecast</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Enter Location</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter city name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="text-center mt-8">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {weatherData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Current Conditions in {weatherData.current.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="font-semibold">{Math.round(weatherData.current.main.temp)}°C</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="font-semibold">{weatherData.current.main.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Wind className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Wind Speed</p>
                    <p className="font-semibold">{Math.round(weatherData.current.wind.speed * 3.6)} km/h</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Compass className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Wind Direction</p>
                    <p className="font-semibold">{weatherData.current.wind.deg}°</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {weatherData.forecast.map((day, index) => {
                  const Icon = getWeatherIcon(day.weather[0].icon)
                  return (
                    <div key={index} className="text-center">
                      <Icon className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                      <h3 className="font-semibold">
                        {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                      </h3>
                      <p className="text-2xl font-bold">{Math.round(day.main.temp)}°C</p>
                      <p className="text-sm text-gray-500">{day.weather[0].description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Umbrella className="mr-2 h-5 w-5" />
                Precipitation Chance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })}
                      </span>
                      <Badge variant="outline">{Math.round(day.pop * 100)}%</Badge>
                    </div>
                    <Progress value={day.pop * 100} className={`h-2 ${getPrecipitationColor(day.pop)}`} />
                    <p className="text-sm text-gray-500">{getPrecipitationDescription(day.pop)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Severe Weather Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {weatherData.alerts && weatherData.alerts.length > 0 ? (
                <ul className="space-y-2">
                  {weatherData.alerts.map((alert, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{alert.event}</span>
                      </div>
                      <Badge>
                        {new Date(alert.start * 1000).toLocaleTimeString()} -{" "}
                        {new Date(alert.end * 1000).toLocaleTimeString()}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No severe weather alerts at this time.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}