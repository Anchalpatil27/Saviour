"use client"

// filepath: c:\Users\ayush\Desktop\Saviour2.O\src\app\dashboard\layout.tsx

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import DashboardLayout from "@/components/DashboardLayout"
import { doc, getDoc } from "firebase/firestore"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!user) {
        setAuthorized(false)
        router.push("/auth/login")
      } else {
        // Check user role in Firestore
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists() && userSnap.data().role === "user") {
          setAuthorized(true)
          setLoading(false)
        } else {
          setAuthorized(false)
          router.push("/auth/login")
        }
      }
    })
    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-semibold text-indigo-700">Loading...</span>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}