import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SafetyGuidelines } from "@/components/safety-guidelines"

export default async function SafetyPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return <SafetyGuidelines />
}

