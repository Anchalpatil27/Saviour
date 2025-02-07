"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { Loader2, WifiOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSocket } from "@/app/contexts/SocketContext"

interface Message {
  id: string
  content: string
  userId: string
  userName: string
  city: string
  createdAt: Date
}

export function CommunityChat() {
  const { data: session } = useSession()
  const socketData = useSocket()
  console.log("CommunityChat: useSocket data", socketData)
  const { socket, isConnected, currentCity, isLoading, error } = socketData
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)

  useEffect(() => {
    console.log("CommunityChat useEffect", { socket, currentCity, isConnected, isLoading, error })
    if (isLoading) {
      console.log("Still loading, skipping effect")
      return
    }
    if (error) {
      console.log("Error in SocketContext:", error)
      return
    }
    if (!socket || !currentCity) {
      console.log("Socket or currentCity not available, skipping effect")
      return
    }

    console.log("Setting up socket event listeners")
    socket.on("new-message", (message: Message) => {
      console.log("New message received", message)
      setMessages((prev) => [message, ...prev])
    })

    socket.on("recent-messages", (recentMessages: Message[]) => {
      console.log("Recent messages received", recentMessages)
      setMessages(recentMessages)
    })

    console.log("Emitting get-recent-messages", currentCity)
    socket.emit("get-recent-messages", currentCity)

    return () => {
      console.log("CommunityChat cleanup")
      if (socket) {
        console.log("Removing socket event listeners")
        socket.off("new-message")
        socket.off("recent-messages")
      }
    }
  }, [socket, currentCity, isConnected, isLoading, error])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("Submitting message", { currentCity, newMessage, isConnected })
    if (!currentCity || !newMessage.trim() || sending || !socket || !isConnected) return

    setSending(true)
    setChatError(null)

    try {
      socket.emit("chat-message", {
        content: newMessage.trim(),
        city: currentCity,
        userId: session?.user?.id || "",
        userName: session?.user?.name || "Anonymous",
      })

      setNewMessage("")
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    console.log("CommunityChat component mounted/updated", {
      isConnected,
      currentCity,
      isLoading,
      error,
    })
  }, [isConnected, currentCity, isLoading, error])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <span className="text-center">Loading chat...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Chat</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{error}</p>
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm">
                  Go to Profile Settings
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!currentCity) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>City Not Set</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Please set your city in your profile to use the chat.</p>
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm">
                  Go to Profile Settings
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Community Chat - {currentCity}</span>
          {!isConnected && (
            <div className="flex items-center text-destructive text-sm">
              <WifiOff className="h-4 w-4 mr-1" />
              Offline
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chatError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{chatError}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4 h-[300px] overflow-y-auto mb-4 p-4 border rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-lg ${
                message.userId === session?.user?.id ? "bg-primary/10 ml-auto" : "bg-muted"
              } max-w-[80%]`}
            >
              <p className="font-semibold text-sm">{message.userName}</p>
              <p className="mt-1">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(message.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Reconnecting..."}
            className="flex-1"
            disabled={sending || !isConnected}
          />
          <Button type="submit" disabled={sending || !isConnected || !newMessage.trim()}>
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CommunityChat

