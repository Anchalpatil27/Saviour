import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import UserForm from "@/components/admin/UserForm"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function EditUserPage({
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
      <h1 className="text-2xl font-bold">Edit User</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UserForm id={params.id} />
      </Suspense>
    </div>
  )
}

