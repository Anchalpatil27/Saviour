import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import UserDetail from "@/components/admin/UserDetail"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function UserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Details</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UserDetail id={params.id} />
      </Suspense>
    </div>
  )
}