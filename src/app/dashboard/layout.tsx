"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import DashboardLayout from "@/components/DashboardLayout"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Auth restriction
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      setAuthLoading(false)
      if (!firebaseUser) router.push("/auth/login")
      else setUser(firebaseUser)
    })
    return () => unsub()
  }, [router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-semibold text-indigo-700">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  ) 
}