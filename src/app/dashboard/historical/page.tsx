import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { LocationBasedHistoricalData } from "@/components/location-based-historical-data"

export default async function HistoricalPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return <LocationBasedHistoricalData />
}

