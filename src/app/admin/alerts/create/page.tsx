import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertForm } from "@/components/admin/AlertForm"

export default async function CreateAlertPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Alert</h1>

      <Card>
        <CardHeader>
          <CardTitle>Alert Details</CardTitle>
          <CardDescription>Create a new alert to notify users</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertForm />
        </CardContent>
      </Card>
    </div>
  )
}

