import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import UserDetail from "@/components/admin/UserDetail"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

// Create a non-dynamic route that gets the ID from the query parameters
export default async function ViewUserPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  const id = searchParams.id

  if (!id) {
    redirect("/admin/users")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Details</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UserDetail id={id} />
      </Suspense>
    </div>
  )
}

