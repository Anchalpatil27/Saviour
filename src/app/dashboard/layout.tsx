import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardLayout from "@/components/DashboardLayout"
import type React from "react"

// Add route segment config for dynamic rendering
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

