'use client'

import { useSession } from "next-auth/react"

export function useUser() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const user = session?.user

  return { user, isLoading }
}
