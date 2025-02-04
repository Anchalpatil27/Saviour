import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserDetails } from "@/lib/getUserDetails"
import { UpdateProfileForm } from "@/components/UpdateProfileForm"
import { UpdatePasswordForm } from "@/components/UpdatePasswordForm"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    redirect("/auth/login")
  }

  const userDetails = await getUserDetails(session.user.email)

  if (!userDetails) {
    return <div>Error loading user details. Please try again later.</div>
  }

  const isOAuthUser = userDetails.provider === "google"

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <UserCircle className="mr-2 h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
            <Avatar className="w-24 h-24 mb-4 sm:mb-0 sm:mr-6">
              <AvatarImage src={userDetails.image || "/placeholder.svg?height=96&width=96"} alt={userDetails.name} />
              <AvatarFallback>{userDetails.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold">{userDetails.name}</h3>
              <p className="text-sm text-gray-500">{userDetails.email}</p>
              <Button className="mt-2" variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
          </div>
          <UpdateProfileForm userDetails={userDetails} isOAuthUser={isOAuthUser} />
        </CardContent>
      </Card>
      {!isOAuthUser && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm userEmail={userDetails.email} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

