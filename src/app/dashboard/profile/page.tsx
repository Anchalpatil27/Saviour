import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ProfileForm } from "@/components/ProfileForm"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/login")
  }

  const { db } = await connectToDatabase()
  const user = await db.collection("users").findOne({ email: session.user.email })

  console.log("Profile page - User from database:", user)

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
      <ProfileForm
        initialData={
          user
            ? {
                name: user.name || null,
                email: user.email || null,
                city: user.city || null,
              }
            : null
        }
      />
    </div>
  )
}

