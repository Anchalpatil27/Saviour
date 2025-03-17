import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { UserTable } from "@/components/admin/UserTable"
import { CityFilter } from "@/components/admin/CityFilter"
// Import the safe MongoDB functions instead of direct MongoDB
import { findOne, find } from "@/lib/mongodb-safe"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

async function getUsers(adminCity: string) {
  try {
    // Use the safe find function instead of direct MongoDB access
    const users = await find("users", { city: adminCity }, { sort: { createdAt: -1 }, limit: 100 })

    return users.map((user: any) => ({
      id: user._id.toString(),
      name: user.name || "No Name",
      email: user.email || "No Email",
      city: user.city || "Not Set",
      role: user.role || "user",
      createdAt: user.createdAt || new Date(),
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
    redirect("/auth/login")
  }

  // Get admin's city using the safe findOne function
  const adminUser = await findOne("users", { email: session.user.email }, { city: 1 })

  if (!adminUser?.city) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <p className="mb-4">
                {!adminUser
                  ? "Your admin profile doesn't exist in the database yet."
                  : "Please set your city in your profile to manage users."}
              </p>
              <Link href="/admin/setup-profile">
                <Button>{!adminUser ? "Set Up Admin Profile" : "Update Admin Profile"}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const adminCity = adminUser.city
  const users = await getUsers(adminCity)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link href={`/admin/users/create?city=${adminCity}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <CityFilter adminCity={adminCity} />

      <Card>
        <CardHeader>
          <CardTitle>
            Users in {adminCity}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({users.length} {users.length === 1 ? "user" : "users"})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search users..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <UserTable users={users} preserveCity={adminCity} />
        </CardContent>
      </Card>
    </div>
  )
}

