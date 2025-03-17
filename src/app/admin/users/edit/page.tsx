import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import UserForm from "@/components/admin/UserForm"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

// Use the correct type for Next.js page props
export default async function EditUserPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  // Handle both string and string[] cases
  const idParam = searchParams.id
  const id = typeof idParam === "string" ? idParam : Array.isArray(idParam) ? idParam[0] : undefined

  if (!id) {
    redirect("/admin/users")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UserForm id={id} />
      </Suspense>
    </div>
  )
}

