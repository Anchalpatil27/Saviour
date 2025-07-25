"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Bell, AlertTriangle, CheckCircle, Users, BarChart, TrendingUp, Map, Book, Users as Community, Plus, Heart, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [weather, setWeather] = useState<any>(null)
  const [sosRaised, setSosRaised] = useState(0)
  const [helpProvided, setHelpProvided] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notificationsCount, setNotificationsCount] = useState(3)
  const router = useRouter()

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        setProfile(userSnap.data())
      } else {
        setProfile(null)
      }
    } catch (e) {
      setProfile(null)
    }
  }

  // Fetch SOS stats
  const fetchSosStats = async (uid: string) => {
    try {
      // SOS Raised: where userId == uid
      const sosRaisedQuery = query(
        collection(db, "sos_requests"),
        where("userId", "==", uid)
      )
      const sosRaisedSnap = await getDocs(sosRaisedQuery)
      setSosRaised(sosRaisedSnap.size)

      // Help Provided: where acceptedBy == uid and status == "accepted" or "responded"
      const helpProvidedQuery = query(
        collection(db, "sos_requests"),
        where("acceptedBy", "==", uid),
        where("status", "in", ["accepted", "responded"])
      )
      const helpProvidedSnap = await getDocs(helpProvidedQuery)
      setHelpProvided(helpProvidedSnap.size)
    } catch (e) {
      setSosRaised(0)
      setHelpProvided(0)
    }
  }

  // Fetch weather using OpenWeatherMap API
  const fetchWeather = async (coords: { latitude: number; longitude: number }) => {
    const apiKey = "120c1d742105474a5f77dbf48559c643"
    try {
      const weatherResp = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${apiKey}`
      )
      setWeather(weatherResp.data)
    } catch (err) {
      setWeather(null)
    }
  }

  // Fetch location using browser Geolocation API
  const fetchLocation = async () => {
    return new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
        },
        () => resolve(null),
        { enableHighAccuracy: true }
      )
    })
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const user = auth.currentUser
      if (!user) return

      // Get location
      const coords = await fetchLocation()
      setLocation(coords)

      // Save location to Firestore under 'weather' collection (document id = user.uid)
      if (coords) {
        const weatherRef = doc(db, "weather", user.uid)
        await setDoc(weatherRef, {
          latitude: coords.latitude,
          longitude: coords.longitude,
          lastLocationUpdate: new Date(),
        })
        await fetchWeather(coords)
      }

      // Fetch user profile and stats
      await fetchUserProfile(user.uid)
      await fetchSosStats(user.uid)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        
        <div className="grid gap-6">
          <Skeleton className="h-[180px] w-full rounded-xl" />
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-[150px]" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-[150px]" />
            <div className="flex gap-4">
              <Skeleton className="h-[120px] w-full rounded-lg" />
              <Skeleton className="h-[120px] w-full rounded-lg" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-6 w-[60px]" />
            </div>
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quick actions
  const quickActions = [
    { title: "Create SOS", icon: <Plus className="w-6 h-6" />, color: "bg-red-500 hover:bg-red-600", route: "/dashboard/sos" },
    { title: "View Map", icon: <Map className="w-6 h-6" />, color: "bg-blue-500 hover:bg-blue-600", route: "/dashboard/navigation" },
    { title: "Resources", icon: <Book className="w-6 h-6" />, color: "bg-green-500 hover:bg-green-600", route: "/dashboard/resources" },
    { title: "Community", icon: <Community className="w-6 h-6" />, color: "bg-yellow-500 hover:bg-yellow-600", route: "/dashboard/chat" },
  ]

  // Safety updates
  const safetyUpdates = [
    { title: "First Aid Tutorial", icon: <CheckCircle className="h-5 w-5 text-green-500" />, description: "Learn essential first aid steps" },
    { title: "Flood Safety", icon: <AlertTriangle className="h-5 w-5 text-blue-500" />, description: "Flood safety rules & video" },
    { title: "Earthquake Safety", icon: <TrendingUp className="h-5 w-5 text-yellow-500" />, description: "Earthquake safety rules & video" },
  ]

  // Greeting
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {greeting()}{profile?.fullName ? `, ${profile.fullName}` : ""}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationsCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {notificationsCount}
              </Badge>
            )}
          </Button>
          
          <Avatar>
            <AvatarImage src={profile?.photoUrl} />
            <AvatarFallback>
              {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Weather Card */}
      <Card className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Current Weather
          </CardTitle>
          <CardDescription className="text-indigo-100">
            {location ? 
              `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 
              "Location unavailable"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weather ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold mb-1">{Math.round(weather.main.temp)}°C</div>
                <div className="text-lg capitalize">{weather.weather[0].description}</div>
                <div className="text-sm mt-2">
                  Feels like {Math.round(weather.main.feels_like)}°C • Humidity {weather.main.humidity}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{weather.name}</div>
                <div className="text-sm">
                  Wind: {Math.round(weather.wind.speed)} m/s
                </div>
              </div>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Weather Unavailable</AlertTitle>
              <AlertDescription>
                Could not fetch weather data for your location
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button 
              key={index} 
              className={`${action.color} text-white h-24 flex flex-col items-center justify-center gap-2 rounded-xl transition-all hover:shadow-md`}
            >
              <div className="p-2 bg-white/20 rounded-full">
                {action.icon}
              </div>
              <span className="font-medium">{action.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Safety Stats */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Safety Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">SOS Raised</span>
                  </div>
                  <div className="text-3xl font-bold">{sosRaised}</div>
                </div>
                <div className="text-sm opacity-80">Last 30 days</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-emerald-400 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">Help Provided</span>
                  </div>
                  <div className="text-3xl font-bold">{helpProvided}</div>
                </div>
                <div className="text-sm opacity-80">Last 30 days</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety Updates */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Safety Updates</h2>
          <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safetyUpdates.map((update, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {update.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{update.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {update.description}
                    </p>
                    <Button variant="link" size="sm" className="px-0 mt-2">
                      Learn more
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}