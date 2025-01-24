"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function CheckAdmin() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.email === "vikrantkrd@gmail.com") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, session, router])

  return <div>Checking credentials...</div>
}

