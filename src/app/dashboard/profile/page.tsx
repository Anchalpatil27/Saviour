import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCircle, Home, Shield } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const user = session.user

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
              <AvatarImage src={user?.image || "/placeholder.svg?height=96&width=96"} alt={user?.name || "User"} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold">{user?.name || "User Name"}</h3>
              <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
              <Button className="mt-2" variant="outline" size="sm">Change Avatar</Button>
            </div>
          </div>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
                <Input id="name" defaultValue={user?.name || ''} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} className="mt-1" readOnly />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm sm:text-base">Phone</Label>
              <Input id="phone" type="tel" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="address" className="text-sm sm:text-base">Address</Label>
              <Input id="address" className="mt-1" />
            </div>
            <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-sm sm:text-base">Current Password</Label>
              <Input id="current-password" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="new-password" className="text-sm sm:text-base">New Password</Label>
              <Input id="new-password" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-sm sm:text-base">Confirm New Password</Label>
              <Input id="confirm-password" type="password" className="mt-1" />
            </div>
            <Button className="w-full sm:w-auto text-sm sm:text-base">Change Password</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="emergency-contact" className="text-sm sm:text-base">Primary Emergency Contact</Label>
              <Input id="emergency-contact" placeholder="Name" className="mt-1 mb-2" />
              <Input id="emergency-contact-phone" type="tel" placeholder="Phone Number" className="mt-1" />
            </div>
            <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base">Add Another Contact</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

