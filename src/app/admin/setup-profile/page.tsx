import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminProfileForm } from "@/components/admin/AdminProfileForm"

export default async function AdminProfileSetupPage() {
  const session = await getServerSession(authOptions)

  // Ensure only the admin can access this page
  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Profile Setup</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create Admin Profile</CardTitle>
          <CardDescription>Set up your admin profile to manage city-specific data</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminProfileForm
            initialData={{
              name: session.user.name || "",
              email: session.user.email || "",
              city: "",
              role: "admin",
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

