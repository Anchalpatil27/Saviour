import { connectToMongoDB } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getUserDetails() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return null
  }

  try {
    const { db } = await connectToMongoDB()
    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      city: user.city,
      image: user.image,
    }
  } catch (error) {
    console.error("Error fetching user details:", error)
    return null
  }
}

