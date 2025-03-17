import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResourceForm } from "@/components/admin/ResourceForm"

export default async function CreateResourcePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Resource</h1>

      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>Add a new resource to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceForm />
        </CardContent>
      </Card>
    </div>
  )
}

