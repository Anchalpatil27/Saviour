import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { DefaultSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.email === "vikrantkrd@gmail.com" ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async signOut({ token }) {
      const userId = token.sub;

      // Ensure userId is defined
      if (!userId) {
        console.error("User ID is undefined during sign-out.");
        return;
      }

      try {
        // 1. Clear all server-side session data
        await prisma.session.deleteMany({
          where: {
            userId: userId,
          },
        });

        // 2. Clear user activity history
        await prisma.activityLog.deleteMany({
          where: {
            userId: userId,
          },
        });

        // 3. Log sign-out activity
        await prisma.activityLog.create({
          data: {
            userId: userId,
            action: "SIGN_OUT",
            details: "User signed out and all data cleared",
          },
        });

        console.log(`User ${userId} signed out and all data cleared.`);
      } catch (error) {
        console.error("Error during sign-out cleanup:", error);
      }
    },
  },
};