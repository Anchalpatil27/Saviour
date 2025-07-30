"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Edit, Trash2, CheckCircle2, Eye, X } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, onSnapshot, doc, updateDoc, getDoc, addDoc, deleteDoc, Timestamp } from "firebase/firestore"
import dynamic from "next/dynamic"
import SOSEditModal from "@/components/Modals/SOSEditModal"
import { AlertTriangle } from "lucide-react"

const EMERGENCY_TYPES = [
  "All",
  "Medical Emergency",
  "Fire Outbreak",
  "Armed Robbery",
  "Car Accident",
  "Domestic Violence",
  "Natural Disaster",
  "Missing Person",
  "Public Disturbance",
  "Other",
]

const LEVEL_COLORS: Record<string, string> = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-blue-500",
}

type SOSRequest = {
  id: string
  userId: string
  latitude: number
  longitude: number
  emergencyType: string
  description: string
  urgency: "High" | "Medium" | "Low"
  createdAt: any
  isPublic: boolean
  senderName?: string
  senderContact?: string
  status?: string
  responderId?: string
  responderName?: string
  responderRole?: string
  address?: string
  imageUrl?: string
}

// Replace GoogleMap and Marker with MapWrapper
const MapWrapper = dynamic(() => import('@/components/MapWrapper'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  )
})

export default function NavigationPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("All")
  const [selectedSOS, setSelectedSOS] = useState<SOSRequest | null>(null)
  const [editingSOS, setEditingSOS] = useState<SOSRequest | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.209 })
  const [showList, setShowList] = useState(true)

  // Auth restriction
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) router.push("/auth/login")
      else setUser(firebaseUser)
    })
    return () => unsub()
  }, [router])

  // Fetch SOS requests
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "sos_requests"), (snapshot) => {
      const allSOS: SOSRequest[] = []
      snapshot.forEach((docSnap) => {
        const data = docSnap.data()
        allSOS.push({
          id: docSnap.id,
          ...data,
        } as SOSRequest)
      })
      setSosRequests(allSOS)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Get user location for map center
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      )
    }
  }, [])

  // Filtering
  const filteredSOS = sosRequests.filter((sos) =>
    typeFilter === "All" ? true : sos.emergencyType === typeFilter
  )

  // Check if current user is the SOS creator
  const isSOSCreator = (sos: SOSRequest) => user && user.uid === sos.userId

  // Respond Action
  const handleRespond = async (sos: SOSRequest) => {
    if (!user) return
    if (isSOSCreator(sos)) return
    try {
      // Fetch user profile
      let userDoc = await getDoc(doc(db, "users", user.uid))
      let userData = userDoc.exists() ? userDoc.data() : null
      let responderRole = "user"
      if (!userData) {
        userDoc = await getDoc(doc(db, "employees", user.uid))
        userData = userDoc.exists() ? userDoc.data() : null
        responderRole = "employee"
      }
      if (!userData) {
        userDoc = await getDoc(doc(db, "admins", user.uid))
        userData = userDoc.exists() ? userDoc.data() : null
        responderRole = "admin"
      }
      const responderName =
        userData?.fullName || userData?.name || user.displayName || user.email || "Unknown"
      await updateDoc(doc(db, "sos_requests", sos.id), {
        status: "responded",
        responderId: user.uid,
        responderName,
        responderRole,
        respondedAt: Timestamp.now(),
      })
      await addDoc(collection(db, "notifications"), {
        userId: sos.userId,
        sosId: sos.id,
        type: "sos_responded",
        message: `Your SOS has been accepted and responded to. Help is on the way from ${responderName} (${responderRole}).`,
        responderId: user.uid,
        responderName,
        responderRole,
        createdAt: Timestamp.now(),
        read: false,
      })
      setSelectedSOS(null)
    } catch (e) {
      console.error("Error responding to SOS:", e)
      alert("Failed to respond to SOS. Please try again later.")
      setSelectedSOS(null)
    }
  }

  // Update SOS
  const handleUpdateSOS = (sos: SOSRequest) => {
    if (!isSOSCreator(sos)) return
    setSelectedSOS(null)
    setEditingSOS(sos)
  }

  // Delete SOS
  const handleDeleteSOS = async (sos: SOSRequest) => {
    if (!isSOSCreator(sos)) return
    try {
      await deleteDoc(doc(db, "sos_requests", sos.id))
      setSelectedSOS(null)
    } catch (e) {
      // ignore
    }
  }

  // Modal update complete
  const handleSOSUpdateComplete = () => {
    setEditingSOS(null)
    setSelectedSOS(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-2">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-2xl font-bold">Emergency Map & Feed</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={showList ? "default" : "outline"}
                  onClick={() => setShowList(true)}
                >
                  List View
                </Button>
                <Button
                  variant={!showList ? "default" : "outline"}
                  onClick={() => setShowList(false)}
                >
                  Map View
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {EMERGENCY_TYPES.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={typeFilter === type ? "default" : "outline"}
                  onClick={() => setTypeFilter(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : showList ? (
              <div className="space-y-4">
                {filteredSOS.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    <AlertTriangle className="mx-auto mb-2 w-8 h-8 text-yellow-500" />
                    No emergencies found.
                  </div>
                )}
                {filteredSOS.map((item) => (
                  <Card key={item.id} className="relative border-l-4 mb-2" style={{ borderLeftColor: LEVEL_COLORS[item.urgency] }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={LEVEL_COLORS[item.urgency]}>{item.urgency}</Badge>
                        <span className="font-bold">{item.emergencyType}</span>
                        <span className="text-xs text-gray-500 ml-2">{item.status || "Open"}</span>
                        {isSOSCreator(item) && (
                          <Badge variant="outline" className="ml-2">Your SOS</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mb-1">{item.description}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <MapPin className="w-4 h-4" />
                        Lat: {item.latitude.toFixed(4)}, Lon: {item.longitude.toFixed(4)}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {isSOSCreator(item) && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleUpdateSOS(item)}>
                              <Edit className="w-4 h-4 mr-1" /> Update
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteSOS(item)}>
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          </>
                        )}
                        {!isSOSCreator(item) && (!item.responderId || item.status !== "responded") && (
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleRespond(item)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Accept & Respond
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setSelectedSOS(item)}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="w-full h-[500px] rounded-lg overflow-hidden">
                <MapWrapper
                  center={mapCenter}
                  markers={filteredSOS.map(sos => ({
                    lat: sos.latitude,
                    lng: sos.longitude,
                    id: sos.id,
                    label: sos.emergencyType
                  }))}
                  onMarkerClick={(id) => {
                    const sos = sosRequests.find(s => s.id === id)
                    if (sos) setSelectedSOS(sos)
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* SOS Edit Modal */}
      <SOSEditModal
        visible={!!editingSOS}
        sosRequest={editingSOS}
        onClose={() => setEditingSOS(null)}
        onUpdate={handleSOSUpdateComplete}
      />
      
      {/* SOS Detail Modal */}
      {selectedSOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => setSelectedSOS(null)}
              tabIndex={-1}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="mb-2 flex items-center gap-2">
              <Badge className={LEVEL_COLORS[selectedSOS.urgency]}>{selectedSOS.urgency}</Badge>
              <span className="font-bold">{selectedSOS.emergencyType}</span>
              <span className="text-xs text-gray-500 ml-2">{selectedSOS.status || "Open"}</span>
              {isSOSCreator(selectedSOS) && (
                <Badge variant="outline" className="ml-2">Your SOS</Badge>
              )}
            </div>
            <div className="text-sm text-gray-700 mb-2">{selectedSOS.description}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <MapPin className="w-4 h-4" />
              Lat: {selectedSOS.latitude.toFixed(4)}, Lon: {selectedSOS.longitude.toFixed(4)}
            </div>
            <div className="flex gap-2 mt-2">
              {isSOSCreator(selectedSOS) && (
                <>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateSOS(selectedSOS)}>
                    <Edit className="w-4 h-4 mr-1" /> Update
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteSOS(selectedSOS)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </>
              )}
              {!isSOSCreator(selectedSOS) && (!selectedSOS.responderId || selectedSOS.status !== "responded") && (
                <Button
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleRespond(selectedSOS)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Accept & Respond
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}