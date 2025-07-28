"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { Mail, Loader2, User, Users, Shield } from "lucide-react"

const USER_ROLES = ["user", "admin"] as const
type UserRole = (typeof USER_ROLES)[number]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("user")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Helper to get collection name by role
  const getCollectionByRole = (role: UserRole) => {
    if (role === "user") return "users"
    return "admins"
  }

  // Email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.")
      return
    }
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const collectionName = getCollectionByRole(selectedRole)
      const userDoc = await getDoc(doc(db, collectionName, userCredential.user.uid))
      if (!userDoc.exists()) {
        setError(`No ${selectedRole} account found for this email.`)
        setLoading(false)
        return
      }
      // Route by role
      if (selectedRole === "admin") {
        router.replace("/admin-dashboard")
      } else {
        router.replace("/dashboard")
      }
    } catch (error: any) {
      let message = "Login failed. Please try again."
      if (error.code === "auth/invalid-email") message = "Invalid email address."
      if (error.code === "auth/user-disabled") message = "This account has been disabled."
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password")
        message = "Invalid email or password."
      if (error.code === "auth/too-many-requests")
        message = "Too many attempts. Please try again later."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Google login
  const handleGoogleLogin = async () => {
    setError(null)
    setGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const collectionName = getCollectionByRole(selectedRole)
      const userDoc = await getDoc(doc(db, collectionName, result.user.uid))
      if (!userDoc.exists()) {
        setError(`No ${selectedRole} account found for this email.`)
        setGoogleLoading(false)
        return
      }
      // Route by role
      if (selectedRole === "admin") {
        router.replace("/admin/dashboard")
      } else {
        router.replace("/dashboard")
      }
    } catch (error: any) {
      setError("Google login failed. Please allow popups.")
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Card className="w-full max-w-md overflow-hidden shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex justify-center gap-2 mb-2">
              {USER_ROLES.map((role) => (
                <Button
                  key={role}
                  type="button"
                  variant={selectedRole === role ? "default" : "outline"}
                  className="flex items-center gap-1"
                  onClick={() => setSelectedRole(role)}
                >
                  {role === "user" ? <User className="w-4 h-4" /> : role === "admin" ? <Users className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Button>
              ))}
            </div>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Login as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </Button>
          </form>
          <div className="relative w-full my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full"
          >
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Google"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}