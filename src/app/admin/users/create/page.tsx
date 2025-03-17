import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "@/components/admin/UserForm"

export default async function CreateUserPage({
  searchParams,
}: {
  searchParams: { city?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  const { city } = searchParams

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New User</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Add a new user to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm defaultCity={city} />
        </CardContent>
      </Card>
    </div>
  )
}

