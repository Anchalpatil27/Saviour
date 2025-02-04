"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CitySelector() {
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCities()
    const storedCity = localStorage.getItem("selectedCity")
    if (storedCity) {
      setSelectedCity(storedCity)
    }
  }, [])

  const fetchCities = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/city")
      if (!response.ok) {
        throw new Error("Failed to fetch cities")
      }
      const data = await response.json()
      setCities(data)
    } catch (err) {
      setError("Error fetching cities. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    localStorage.setItem("selectedCity", city)
  }

  if (isLoading) {
    return <div>Loading cities...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Select onValueChange={handleCityChange} value={selectedCity}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select your city" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

