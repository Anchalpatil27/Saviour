import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/db/schema"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        await connectToDatabase()

        const user = await User.findOne({ username: credentials.username })
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password!)
        if (!isValid) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase()

        const existingUser = await User.findOne({ email: user.email })
        if (existingUser) {
          // Update user info if needed
          await User.findOneAndUpdate(
            { email: user.email },
            {
              name: user.name,
              image: user.image,
              updatedAt: new Date(),
            },
          )
          return true
        }

        // If user doesn't exist, redirect to complete profile
        return `/auth/complete-profile?email=${user.email}&name=${user.name}&image=${user.image}`
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.email || user.name || "unknown"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
}

