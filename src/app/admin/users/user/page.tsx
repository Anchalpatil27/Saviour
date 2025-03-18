import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import UserDetail from "@/components/admin/UserDetail"
import UserForm from "@/components/admin/UserForm"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function UserPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  // Await the promise to resolve the params correctly
  const { id, mode } = await searchParams

  if (!id) {
    redirect("/admin/users")
  }

  const isEdit = mode === "edit"

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{isEdit ? "Edit User" : "User Details"}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {isEdit ? <UserForm id={id} /> : <UserDetail id={id} />}
      </Suspense>
    </div>
  )
}
