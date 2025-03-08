import { Suspense } from "react"
import { CommunityChat } from "@/components/community-chat"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin } from "lucide-react"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"

export default async function CommunityPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/login")
  }

  // Get user from database to get the city
  const { db } = await connectToMongoDB()
  const user = await db.collection("users").findOne({ email: session.user.email })

  if (!user) {
    redirect("/auth/login")
  }

  // Generate userId from _id or use existing id
  const userId = user._id ? user._id.toString() : user.id

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Community Chat</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {user.city ? `Chatting with people from ${user.city}` : "Connect with people in your area"}
        </p>
      </div>

      {!user.city ? (
        <div className="bg-card border rounded-xl p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Set Your City to Join the Chat</h2>
          <p className="text-muted-foreground mb-6">
            You need to set your city in your profile to join community chats with people in your area.
          </p>
          <Button asChild>
            <Link href="/dashboard/profile">Update Profile</Link>
          </Button>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="h-[400px] w-full flex items-center justify-center bg-card rounded-xl border">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-muted-foreground">Loading chat messages...</p>
              </div>
            </div>
          }
        >
          <CommunityChat
            userId={userId}
            userCity={user.city}
            userName={user.name}
          />
        </Suspense>
      )}
    </div>
  )
}

