import type { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "@/lib/dbConnect"
import { User } from "@/lib/db/schema"
import bcrypt from "bcryptjs"

// Extend the User type to include the role property
declare module "next-auth" {
  interface User {
    id?: string
    role?: string
  }
}

// Extend the Session type to include the id and role properties
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string
      role?: string
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          return null
        }

        await dbConnect()

        const user = await User.findOne({
          $or: [{ email: credentials.emailOrUsername }, { username: credentials.emailOrUsername }],
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.email === "vikrantkrd@gmail.com" ? "admin" : "user",
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect()
        const existingUser = await User.findOne({ email: user.email })
        if (!existingUser) {
          // If the user doesn't exist in the database, create a new user
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}