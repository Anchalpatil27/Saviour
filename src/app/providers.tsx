"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import { AltitudePlacesProvider } from "@/lib/stores/altitude-context-simple"

type ProvidersProps = {
  children: React.ReactNode
  session: Session | null
}

export function Providers({ children, session }: ProvidersProps) {
  // Let's go back to JSX which is more reliable for this case
  return (
    <SessionProvider session={session}>
      <AltitudePlacesProvider>{children}</AltitudePlacesProvider>
    </SessionProvider>
  )
}

