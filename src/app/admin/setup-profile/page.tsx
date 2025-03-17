import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
// Updated import to use default import
import AdminProfileForm from "@/components/admin/AdminProfileForm"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function SetupProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Profile Setup</h1>
      <AdminProfileForm />
    </div>
  )
}

