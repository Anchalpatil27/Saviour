import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { LocationBasedSafety } from "@/components/location-based-safety"

export default async function SafetyPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return <LocationBasedSafety />
}

