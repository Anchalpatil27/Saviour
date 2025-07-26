"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { LocationBasedHistoricalData } from "@/components/location-based-historical-data"

export default function HistoricalPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Auth restriction
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) router.push("/auth/login")
      else setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsub()
  }, [router])

  if (loading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-card rounded-xl border">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return <LocationBasedHistoricalData />
}