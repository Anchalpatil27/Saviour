"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Camera, Ban, Key, Timer, MapPin, Save, User, ShieldAlert, Mail, HeartPulse, Bell, ChevronRight, Loader2 } from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, setDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore"
import { updatePassword } from "firebase/auth"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

type HelpHistoryItem = {
  id: string
  latitude?: number
  longitude?: number
  emergencyType?: string
  createdAt?: any
  description?: string
  status?: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [medical, setMedical] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [blockedUsers, setBlockedUsers] = useState<string[]>([])
  const [helpHistory, setHelpHistory] = useState<HelpHistoryItem[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [cityLoading, setCityLoading] = useState(true)
  const [modal, setModal] = useState<null | "changePassword" | "blockUser" | "unblockUser" | "reportAbuse">(null)
  const [modalValue, setModalValue] = useState("")
  const [modalError, setModalError] = useState<string | null>(null)
  const router = useRouter()

  // Auth state and redirect if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        router.push("/auth/login")
      } else {
        setUser(firebaseUser)
      }
    })
    return () => unsubscribe()
  }, [router])

  // Fetch profile and help history
  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setProfile(data)
          setName(data.fullName || "")
          setContact(data.contact || "")
          setMedical(data.medical || "")
          setNotifications(data.notifications ?? true)
          setPhoto(data.photoUrl || null)
          setBlockedUsers(data.blockedUsers || [])
        } else {
          await setDoc(doc(db, "users", user.uid), {
            fullName: user.displayName || "",
            contact: user.phoneNumber || "",
            medical: "",
            notifications: true,
            photoUrl: null,
            blockedUsers: [],
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
        // Help history
        const q = query(collection(db, "sos_requests"), where("userId", "==", user.uid))
        const snap = await getDocs(q)
        setHelpHistory(
          snap.docs
            .map((doc) => ({ ...doc.data(), id: doc.id } as HelpHistoryItem))
            .sort((a, b) => {
              const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
              const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
              return bDate.getTime() - aDate.getTime()
            })
        )
      } catch (e) {
        console.error("Error fetching profile:", e)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [user])

  // Fetch city from browser location
  useEffect(() => {
    setCityLoading(true)
    if (!("geolocation" in navigator)) {
      setCity(null)
      setCityLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          )
          const data = await resp.json()
          setCity(data.address?.city || data.address?.town || data.address?.village || null)
        } catch {
          setCity(null)
        }
        setCityLoading(false)
      },
      () => {
        setCity(null)
        setCityLoading(false)
      },
      { enableHighAccuracy: true }
    )
  }, [])

  // Image preview
  useEffect(() => {
    if (!photo) {
      setImagePreview(null)
      return
    }
    if (photo.startsWith("data:image")) {
      setImagePreview(photo)
      return
    }
    if (photo.startsWith("firestore://")) {
      // Fetch base64 from Firestore
      const imageId = photo.split("/").pop()
      getDoc(doc(db, "profile_images", imageId!)).then((imgDoc) => {
        if (imgDoc.exists()) setImagePreview(imgDoc.data().imageData)
        else setImagePreview(null)
      })
    } else {
      setImagePreview(photo)
    }
  }, [photo])

  // Save profile
  const saveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName: name,
        contact,
        medical,
        notifications,
        photoUrl: photo,
        blockedUsers,
        updatedAt: new Date(),
      })
      alert("Profile updated successfully!")
    } catch (e) {
      alert("Failed to update profile. Please try again.")
    }
    setSaving(false)
  }

  // Pick and upload profile photo
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024) {
      alert("Please select an image smaller than 500KB.")
      return
    }
    setPhotoUploading(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      const imageId = `user_${user.uid}_${Date.now()}`
      try {
        await setDoc(doc(db, "profile_images", imageId), {
          userId: user.uid,
          imageData: base64,
          createdAt: new Date(),
          type: "user_profile",
        })
        const imageUrl = `firestore://profile_images/${imageId}`
        setPhoto(imageUrl)
        setImagePreview(base64)
        await updateDoc(doc(db, "users", user.uid), {
          photoUrl: imageUrl,
          photoUpdatedAt: new Date(),
        })
        alert("Profile photo updated successfully!")
      } catch (e) {
        alert("Failed to upload profile photo.")
      } finally {
        setPhotoUploading(false)
      }
    }
    reader.onerror = () => {
      setPhotoUploading(false)
      alert("Failed to read image file.")
    }
    reader.readAsDataURL(file)
  }

  // Change password modal
  const handleChangePassword = async () => {
    setModal("changePassword")
    setModalValue("")
    setModalError(null)
  }
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError(null)
    if (!modalValue || modalValue.length < 6) {
      setModalError("Password must be at least 6 characters.")
      return
    }
    try {
      await updatePassword(auth.currentUser!, modalValue)
      setModal(null)
      alert("Password changed successfully.")
    } catch (e: any) {
      setModalError(e?.message || "Failed to change password.")
    }
  }

  // Block user modal
  const handleBlockUser = () => {
    setModal("blockUser")
    setModalValue("")
    setModalError(null)
  }
  const handleBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError(null)
    if (!modalValue || !modalValue.includes("@")) {
      setModalError("Please enter a valid email address.")
      return
    }
    if (blockedUsers.includes(modalValue)) {
      setModalError("This user is already blocked.")
      return
    }
    const updated = [...blockedUsers, modalValue]
    setBlockedUsers(updated)
    await updateDoc(doc(db, "users", user.uid), { blockedUsers: updated })
    setModal(null)
    alert("User has been blocked.")
  }

  // Unblock user modal
  const handleUnblockUser = () => {
    setModal("unblockUser")
    setModalValue("")
    setModalError(null)
  }
  const handleUnblockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError(null)
    if (!modalValue || !blockedUsers.includes(modalValue)) {
      setModalError("This user is not currently blocked.")
      return
    }
    const updated = blockedUsers.filter((u) => u !== modalValue)
    setBlockedUsers(updated)
    await updateDoc(doc(db, "users", user.uid), { blockedUsers: updated })
    setModal(null)
    alert("User has been unblocked.")
  }

  // Report abuse modal
  const handleReportAbuse = () => {
    setModal("reportAbuse")
    setModalValue("")
    setModalError(null)
  }
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError(null)
    if (!modalValue || modalValue.length < 10) {
      setModalError("Please provide a detailed description (minimum 10 characters).")
      return
    }
    try {
      await addDoc(collection(db, "abuse_reports"), {
        userId: user?.uid,
        userEmail: user?.email,
        description: modalValue,
        createdAt: new Date(),
        status: "pending",
        userType: "user",
      })
      setModal(null)
      alert("Your report has been submitted. Thank you.")
    } catch (e) {
      setModalError("Failed to submit report. Please try again.")
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-3xl space-y-6">
          <Skeleton className="h-12 w-1/3 rounded-lg" />
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-indigo-600 dark:bg-indigo-800 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">My Profile</CardTitle>
                <CardDescription className="text-indigo-100">
                  Manage your account settings and emergency history
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-indigo-600 dark:text-indigo-400">
                {user?.email}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Profile Section */}
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg">
                    {photoUploading ? (
                      <div className="flex items-center justify-center w-full h-full bg-gray-100">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                      </div>
                    ) : imagePreview ? (
                      <AvatarImage src={imagePreview} />
                    ) : (
                      <AvatarFallback className="bg-indigo-100 text-indigo-800 text-4xl">
                        {name ? name.charAt(0).toUpperCase() : <User className="w-16 h-16" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors shadow-md">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                      disabled={photoUploading}
                    />
                  </label>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">
                      {cityLoading ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Detecting location...
                        </span>
                      ) : city ? (
                        city
                      ) : (
                        "Location unavailable"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Number
                  </label>
                  <Input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Phone number"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medical Information
                </label>
                <Textarea
                  value={medical}
                  onChange={(e) => setMedical(e.target.value)}
                  placeholder="Allergies, conditions, medications, etc."
                  rows={3}
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">Notifications</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Receive alerts and updates
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <Button
                onClick={saveProfile}
                disabled={saving}
                className="w-full py-6 text-lg font-bold shadow-lg"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Profile
                  </div>
                )}
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                Account Security
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-between p-4 h-auto"
                  onClick={handleChangePassword}
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-medium">Change Password</div>
                      <div className="text-sm text-gray-500">Update your login credentials</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-between p-4 h-auto"
                  onClick={handleBlockUser}
                >
                  <div className="flex items-center gap-3">
                    <Ban className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium">Block User</div>
                      <div className="text-sm text-gray-500">Restrict communications</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-between p-4 h-auto"
                  onClick={handleUnblockUser}
                >
                  <div className="flex items-center gap-3">
                    <Ban className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Unblock User</div>
                      <div className="text-sm text-gray-500">Remove restrictions</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-between p-4 h-auto"
                  onClick={handleReportAbuse}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Report Issue</div>
                      <div className="text-sm text-gray-500">File a complaint</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Help History Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-indigo-600" />
                Emergency History
              </h3>

              {helpHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Timer className="w-10 h-10 text-gray-400 mb-3" />
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">No emergency requests yet</h4>
                  <p className="text-sm text-gray-500 max-w-md mt-1">
                    Your past emergency alerts will appear here when you use the SOS feature.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {helpHistory.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{item.emergencyType || "Emergency"}</span>
                              {item.status && (
                                <Badge
                                  variant={
                                    item.status === "active"
                                      ? "destructive"
                                      : item.status === "resolved"
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {item.status}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {item.createdAt?.toDate
                                ? item.createdAt.toDate().toLocaleString()
                                : item.createdAt || "N/A"}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                            {item.description}
                          </p>
                        )}
                        {typeof item.latitude === "number" && typeof item.longitude === "number" && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                            <MapPin className="w-3 h-3" />
                            {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Dialog open={!!modal} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {modal === "changePassword"
                ? "Change Password"
                : modal === "blockUser"
                ? "Block User"
                : modal === "unblockUser"
                ? "Unblock User"
                : "Report Abuse"}
            </DialogTitle>
            <DialogDescription>
              {modal === "changePassword"
                ? "Enter your new password (minimum 6 characters)"
                : modal === "blockUser"
                ? "Enter the email of the user you want to block"
                : modal === "unblockUser"
                ? "Enter the email of the user you want to unblock"
                : "Please describe the issue you're experiencing"}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={
              modal === "changePassword"
                ? handlePasswordSubmit
                : modal === "blockUser"
                ? handleBlockSubmit
                : modal === "unblockUser"
                ? handleUnblockSubmit
                : handleReportSubmit
            }
            className="space-y-4"
          >
            {modal === "changePassword" ? (
              <Input
                type="password"
                placeholder="New password"
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
                autoFocus
              />
            ) : modal === "blockUser" || modal === "unblockUser" ? (
              <Input
                type="email"
                placeholder="user@example.com"
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
                autoFocus
              />
            ) : (
              <Textarea
                placeholder="Describe the issue..."
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
                rows={4}
                autoFocus
              />
            )}
            {modalError && <div className="text-red-500 text-sm">{modalError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button type="submit">
                {modal === "changePassword"
                  ? "Update Password"
                  : modal === "blockUser"
                  ? "Block User"
                  : modal === "unblockUser"
                  ? "Unblock User"
                  : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}