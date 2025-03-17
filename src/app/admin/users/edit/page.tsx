import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import UserForm from "@/components/admin/UserForm"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function EditUserPage({
  searchParams,
}: {
  searchParams: { id?: string }
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
      <h1 className="text-2xl font-bold">Edit User</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UserForm id={id} />
      </Suspense>
    </div>
  )
}

