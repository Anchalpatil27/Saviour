"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Info, MapPin } from "lucide-react"

type Alert = {
  id: string
  type: "warning" | "info" | "danger"
  title: string
  message: string
  location: string
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY

export default function AlertsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [geoError, setGeoError] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.209 }) // Delhi fallback

  // Auth restriction
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) router.push("/auth/login")
      else setUser(firebaseUser)
    })
    return () => unsub()
  }, [router])

  // Get user location
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGeoError(true)
      )
    }
  }, [])

  // Fetch alerts from Gemini API
  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true)
      try {
        const prompt = `Give me a list of important public safety alerts (weather, disaster, crime, traffic, health, etc.) for the area at latitude ${location.lat}, longitude ${location.lng} from today to the previous 7 days. Format each alert as: {type: warning|info|danger, title, message, location}. Return as JSON array.`
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        })
        const data = await response.json()
        // Gemini returns text, so we need to parse the JSON from its response
        let alertsArr: Alert[] = []
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          try {
            alertsArr = JSON.parse(data.candidates[0].content.parts[0].text)
          } catch {
            // fallback: try to extract JSON from text
            const match = data.candidates[0].content.parts[0].text.match(/\[.*\]/)
            if (match) alertsArr = JSON.parse(match[0])
          }
        }
        setAlerts(alertsArr)
      } catch (e) {
        setAlerts([])
      }
      setLoading(false)
    }
    fetchAlerts()
  }, [location])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Real-Time Alerts</h2>
      </div>
      {geoError && (
        <div className="text-sm text-yellow-600 mb-2">
          Unable to access your location. Showing alerts for Delhi.
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-32">Loading alerts...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {alerts.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500">No alerts found for your area in the past week.</div>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id || alert.title} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    {alert.type === "warning" && <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />}
                    {alert.type === "info" && <Info className="mr-2 h-5 w-5 text-blue-500" />}
                    {alert.type === "danger" && <Bell className="mr-2 h-5 w-5 text-red-500" />}
                    {alert.title}
                  </CardTitle>
                  <Badge
                    variant={alert.type === "warning" ? "default" : alert.type === "danger" ? "destructive" : "secondary"}
                  >
                    {alert.type.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{alert.message}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    {alert.location}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}