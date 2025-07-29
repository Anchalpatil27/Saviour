"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle, XCircle, MapPin, ImagePlus, AlertCircle, Loader2 } from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { Progress } from "@/components/ui/progress"

type EmergencyType =
  | "Medical Emergency"
  | "Fire Outbreak"
  | "Armed Robbery"
  | "Car Accident"
  | "Domestic Violence"
  | "Natural Disaster"
  | "Missing Person"
  | "Public Disturbance"
  | "Other"

type AlertLevel = "Low" | "Medium" | "High"

const emergencyTypes: EmergencyType[] = [
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

const alertLevels: AlertLevel[] = ["Low", "Medium", "High"]

const alertLevelColors = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-500",
  High: "bg-red-500"
}

const emergencyTypeIcons = {
  "Medical Emergency": "🩺",
  "Fire Outbreak": "🔥",
  "Armed Robbery": "🔫",
  "Car Accident": "🚗",
  "Domestic Violence": "⚠️",
  "Natural Disaster": "🌪️",
  "Missing Person": "👤",
  "Public Disturbance": "🚨",
  "Other": "❓"
}

function normalizeCity(city: string | null): string | null {
  return city ? city.trim().toLowerCase() : null
}

function EmergencyTypePicker({
  selectedType,
  onSelect,
}: {
  selectedType: EmergencyType | null
  onSelect: (type: EmergencyType) => void
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Emergency Type <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {emergencyTypes.map((type) => (
          <button
            key={type}
            type="button"
            className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
              selectedType === type
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
                : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-gray-800"
            }`}
            onClick={() => onSelect(type)}
          >
            <span className="text-2xl mb-1">{emergencyTypeIcons[type]}</span>
            <span className="text-sm font-medium text-center">{type}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function AlertLevelPicker({
  selectedLevel,
  onSelect,
}: {
  selectedLevel: AlertLevel | null
  onSelect: (level: AlertLevel) => void
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Alert Level <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-3">
        {alertLevels.map((level) => (
          <button
            key={level}
            type="button"
            className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-200 ${
              selectedLevel === level
                ? `${alertLevelColors[level]} text-white font-bold shadow-md`
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
            onClick={() => onSelect(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SOSPage() {
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<EmergencyType | null>(null)
  const [selectedAlertLevel, setSelectedAlertLevel] = useState<AlertLevel>("High")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [sosSent, setSosSent] = useState(false)
  const [canCancel, setCanCancel] = useState(false)
  const [cancelCountdown, setCancelCountdown] = useState(5)
  const [locationError, setLocationError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationError(true)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          )
          const data = await resp.json()
          setCity(data.address?.city || data.address?.town || data.address?.village || null)
        } catch {
          setCity(null)
        }
      },
      () => {
        setLocationError(true)
        setUserLocation(null)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | undefined
    if (sosSent && canCancel) {
      if (cancelCountdown > 0) {
        timerId = setTimeout(() => setCancelCountdown(cancelCountdown - 1), 1000)
      } else {
        setCanCancel(false)
      }
    }
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [sosSent, canCancel, cancelCountdown])

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null)
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(imageFile)
  }, [imageFile])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024) {
      alert("Please select an image smaller than 500KB.")
      return
    }
    setImageFile(file)
  }

  const uploadImageAsBase64 = async (file: File): Promise<string> => {
    setImageUploading(true)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(",")[1]
        if (base64String.length > 1000000) {
          setImageUploading(false)
          reject(new Error("Image too large for Firestore."))
          return
        }
        const dataUrl = `data:${file.type};base64,${base64String}`
        try {
          const user = auth.currentUser
          if (!user) throw new Error("User not authenticated")
          await addDoc(collection(db, "sos_images"), {
            userId: user.uid,
            imageData: dataUrl,
            uploadedAt: new Date().toISOString(),
            contentType: file.type,
            purpose: "sos_request",
          })
          setImageUploading(false)
          resolve(dataUrl)
        } catch (err) {
          setImageUploading(false)
          reject(err)
        }
      }
      reader.onerror = () => {
        setImageUploading(false)
        reject(new Error("Failed to read image file."))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSendSOS = async () => {
    if (!selectedEmergencyType) {
      alert("Please select an emergency type.")
      return
    }
    if (!userLocation) {
      alert("Could not fetch your location. Please enable location services.")
      return
    }
    if (!city) {
      alert("Could not determine your city. Please try again.")
      return
    }
    setIsSending(true)
    try {
      const user = auth.currentUser
      if (!user) {
        alert("You must be logged in to send SOS.")
        setIsSending(false)
        return
      }
      let imageUrl = null
      if (imageFile) {
        try {
          imageUrl = await uploadImageAsBase64(imageFile)
        } catch (error: any) {
          console.error("Image upload error:", error)
          alert(error.message || "Failed to upload image. Continuing without image.")
        }
      }
      await addDoc(collection(db, "sos_requests"), {
        userId: user.uid,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        city: normalizeCity(city),
        emergencyType: selectedEmergencyType,
        alertLevel: selectedAlertLevel,
        description,
        createdAt: serverTimestamp(),
        isPublic: true,
        senderName: user.displayName || user.email?.split('@')[0] || "Anonymous",
        senderContact: user.phoneNumber || user.email || "",
        imageUrl: imageUrl || null,
        status: "active",
      })
      setSosSent(true)
      setCanCancel(true)
      setCancelCountdown(5)
    } catch (e) {
      console.error("SOS submission error:", e)
      alert("Failed to send SOS. Please try again.")
    }
    setIsSending(false)
  }

  const handleCancelSOS = () => {
    setSosSent(false)
    setCanCancel(false)
    setSelectedEmergencyType(null)
    setSelectedAlertLevel("High")
    setDescription("")
    setImageFile(null)
    setImagePreview(null)
    alert("Your SOS alert has been cancelled.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Emergency Alert System</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {sosSent 
              ? "Help is on the way!" 
              : "Send an emergency alert to nearby responders and authorities"}
          </p>
        </div>

        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-indigo-600 dark:bg-indigo-800 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {sosSent ? "Alert Activated" : "Initiate Emergency Alert"}
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  {sosSent 
                    ? "Responders have been notified of your situation" 
                    : "Fill in the details below to request assistance"}
                </CardDescription>
              </div>
              <div className={`p-3 rounded-full ${sosSent ? 'bg-green-500' : 'bg-red-500'} shadow-md`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {sosSent ? (
              <div className="flex flex-col items-center py-8 space-y-6">
                <div className="relative">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <div className="absolute -inset-4 border-4 border-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Alert Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Your location and emergency details have been dispatched to nearby responders.
                    Stay calm and wait for assistance.
                  </p>
                </div>
                
                {canCancel && (
                  <div className="w-full max-w-xs space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">
                        You can cancel this alert within the next:
                      </p>
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {cancelCountdown} seconds
                      </div>
                    </div>
                    <Progress value={(cancelCountdown / 5) * 100} className="h-2" />
                    <Button 
                      variant="destructive" 
                      onClick={handleCancelSOS}
                      className="w-full py-6 text-lg font-bold"
                    >
                      Cancel Emergency Alert
                    </Button>
                  </div>
                )}
                
                {!canCancel && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSosSent(false)}
                    className="mt-4"
                  >
                    Back to Alert Form
                  </Button>
                )}
              </div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={e => {
                  e.preventDefault()
                  handleSendSOS()
                }}
              >
                <EmergencyTypePicker 
                  selectedType={selectedEmergencyType} 
                  onSelect={setSelectedEmergencyType} 
                />
                
                <AlertLevelPicker 
                  selectedLevel={selectedAlertLevel} 
                  onSelect={setSelectedAlertLevel} 
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Details (optional)
                  </label>
                  <Textarea
                    placeholder="Provide more information about the emergency (e.g., number of people involved, specific injuries, description of suspects, etc.)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attach Photo (optional)
                    <span className="text-xs text-gray-500 ml-1">Max 500KB</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Add Photo</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        disabled={imageUploading}
                        className="hidden" 
                      />
                    </label>
                    
                    {imageUploading && (
                      <div className="flex items-center justify-center w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                      </div>
                    )}
                    
                    {imagePreview && !imageUploading && (
                      <div className="relative group">
                        <img 
                          src={imagePreview} 
                          alt="Emergency preview" 
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview(null)
                          }}
                        >
                          <XCircle className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Your Current Location</h4>
                      {userLocation ? (
                        <>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Coordinates: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                          </p>
                          {city && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              Estimated location: {city}
                            </p>
                          )}
                        </>
                      ) : locationError ? (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Could not access your location. Please enable location services.
                        </p>
                      ) : (
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Detecting your location...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full py-6 text-lg font-bold shadow-lg"
                  disabled={isSending || imageUploading || !userLocation}
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Emergency Alert...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      SEND EMERGENCY ALERT
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  By sending this alert, you agree to share your location and emergency details with responders.
                  Only use for genuine emergencies.
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>In case you can't use this form, call emergency services directly.</p>
        </div>
      </div>
    </div>
  )
}