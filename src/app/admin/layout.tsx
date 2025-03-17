import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminLayout from "@/components/AdminLayout"
import type React from "react"

// Add route segment config for dynamic rendering
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  return <AdminLayout>{children}</AdminLayout>
}

