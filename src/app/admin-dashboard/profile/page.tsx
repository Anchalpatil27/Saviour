"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Camera, Key, Loader2, MapPin, Save, User, ShieldAlert, Bell, ChevronRight, Ban, CheckCircle2 } from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from "firebase/firestore"
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

type UserItem = {
  id: string
  email: string
  fullName?: string
  blocked?: boolean
  role?: string
}

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [cityLoading, setCityLoading] = useState(true)
  const [modal, setModal] = useState<null | "changePassword" | "blockUser" | "unblockUser">(null)
  const [modalValue, setModalValue] = useState("")
  const [modalError, setModalError] = useState<string | null>(null)
  const [users, setUsers] = useState<UserItem[]>([])
  const [blockLoading, setBlockLoading] = useState(false)
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

  // Fetch admin profile
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
          setNotifications(data.notifications ?? true)
          setPhoto(data.photoUrl || null)
        } else {
          await setDoc(doc(db, "users", user.uid), {
            fullName: user.displayName || "",
            contact: user.phoneNumber || "",
            notifications: true,
            photoUrl: null,
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
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
        notifications,
        photoUrl: photo,
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
      const imageId = `admin_${user.uid}_${Date.now()}`
      try {
        await setDoc(doc(db, "profile_images", imageId), {
          userId: user.uid,
          imageData: base64,
          createdAt: new Date(),
          type: "admin_profile",
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

  // Fetch all users for block/unblock
  const fetchAllUsers = async () => {
    setBlockLoading(true)
    try {
      const snap = await getDocs(collection(db, "users"))
      setUsers(
        snap.docs
          .map((doc) => ({
            id: doc.id,
            email: doc.data().email,
            fullName: doc.data().fullName,
            blocked: doc.data().blocked || false,
            role: doc.data().role,
          }))
          .filter((u) => u.email !== user.email)
      )
    } catch (e) {
      alert("Failed to fetch users.")
    }
    setBlockLoading(false)
  }

  // Block user modal
  const handleBlockUser = () => {
    fetchAllUsers()
    setModal("blockUser")
    setModalValue("")
    setModalError(null)
  }
  const handleBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError(null)
    if (!modalValue) {
      setModalError("Please select a user.")
      return
    }
    try {
      await updateDoc(doc(db, "users", modalValue), { blocked: true })
      setUsers(users.map(u => u.id === modalValue ? { ...u, blocked: true } : u))
      setModal(null)
      alert("User has been blocked.")
    } catch (e) {
      setModalError("Failed to block user.")
    }
  }

  // Unblock user modal
  const handleUnblockUser = () => {
    fetchAllUsers()
    setModal("unblockUser")
    setModalValue("")
    setModalError(null)
  }
  const handleUnblockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError(null)
    if (!modalValue) {
      setModalError("Please select a user.")
      return
    }
    try {
      await updateDoc(doc(db, "users", modalValue), { blocked: false })
      setUsers(users.map(u => u.id === modalValue ? { ...u, blocked: false } : u))
      setModal(null)
      alert("User has been unblocked.")
    } catch (e) {
      setModalError("Failed to unblock user.")
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-3xl space-y-6">
          <div className="h-12 w-1/3 rounded-lg bg-gray-200 animate-pulse" />
          <div className="flex flex-col items-center gap-4">
            <div className="h-32 w-32 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-10 w-48 rounded-lg bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-24 w-full rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Admin Profile</CardTitle>
                <CardDescription className="text-indigo-100">
                  Manage your admin account and actions
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-indigo-600 bg-white">
                {user?.email}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Profile Section */}
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <Input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Phone number"
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">Notifications</div>
                    <div className="text-sm text-gray-500">
                      Receive admin alerts and updates
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <Button
                onClick={saveProfile}
                disabled={saving}
                className="w-full py-6 text-lg font-bold shadow-lg"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Save Profile</>}
              </Button>
            </div>

            {/* Security Section */}
            <div className="space-y-4 mt-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                Admin Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-between p-4 h-auto"
                  onClick={handleChangePassword}
                >
                  <Key className="w-5 h-5 text-gray-400 mr-2" />
                  Change Password
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-between p-4 h-auto"
                  onClick={handleBlockUser}
                >
                  <Ban className="w-5 h-5 text-gray-400 mr-2" />
                  Block User
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-between p-4 h-auto"
                  onClick={handleUnblockUser}
                >
                  <CheckCircle2 className="w-5 h-5 text-gray-400 mr-2" />
                  Unblock User
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
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
                : "Unblock User"}
            </DialogTitle>
            <DialogDescription>
              {modal === "changePassword"
                ? "Enter your new password (minimum 6 characters)"
                : modal === "blockUser"
                ? "Select a user to block"
                : "Select a user to unblock"}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={
              modal === "changePassword"
                ? handlePasswordSubmit
                : modal === "blockUser"
                ? handleBlockSubmit
                : handleUnblockSubmit
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
            ) : (
              <select
                className="w-full border rounded p-2"
                value={modalValue}
                onChange={e => setModalValue(e.target.value)}
                autoFocus
              >
                <option value="">Select user</option>
                {users
                  .filter(u => modal === "blockUser" ? !u.blocked : u.blocked)
                  .map(u => (
                    <option key={u.id} value={u.id}>
                      {u.fullName || u.email} ({u.email}) {u.role === "admin" ? "[admin]" : ""}
                    </option>
                  ))}
              </select>
            )}
            {modalError && <div className="text-red-500 text-sm">{modalError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={blockLoading}>
                {blockLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  modal === "changePassword"
                    ? "Update Password"
                    : modal === "blockUser"
                    ? "Block User"
                    : "Unblock User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}