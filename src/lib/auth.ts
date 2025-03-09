import dbConnect from "@/lib/dbConnect"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { User } from "@/lib/db/schema"
import type { DefaultSession, DefaultUser } from "next-auth"
import type { ObjectId } from "mongodb"

// Extend the User type to include the `id` property
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string
  }

  interface Session extends DefaultSession {
    user?: User
  }
}

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

        await dbConnect()

        const user = await User.findOne({ username: credentials.username })
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password!)
        if (!isValid) return null

        return {
          id: (user._id as ObjectId).toString(), // Cast _id to ObjectId
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
        await dbConnect()

        const existingUser = await User.findOne({ email: user.email })
        if (existingUser) {
          // Use optional chaining to safely check username
          if (!existingUser.username) {
            // User exists but hasn't completed their profile
            return `/auth/complete-profile?email=${user.email}&name=${user.name}&image=${user.image}`
          }
          // User exists and has completed their profile, allow sign in
          return true
        }

        // If user doesn't exist, create a new user record and redirect to complete profile
        await User.create({
          email: user.email,
          name: user.name,
          image: user.image,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        return `/auth/complete-profile?email=${user.email}&name=${user.name}&image=${user.image}`
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
}