"use client"

import React, { useEffect, useState, Suspense } from "react";
import { CommunityChat } from "@/components/community-chat";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CommunityPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auth restriction
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/auth/login");
      } else {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ ...userDoc.data(), id: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName });
        } else {
          // If user doc doesn't exist, redirect to login or profile setup
          router.push("/auth/login");
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-card rounded-xl border">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userId = user.id;

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
  );
}