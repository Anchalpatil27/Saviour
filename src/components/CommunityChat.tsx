"use client"

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
  const { socket, isConnected, currentCity, isLoading, error } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)

  useEffect(() => {
    if (!socket || !currentCity) return

    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [message, ...prev])
    })

    socket.on("recent-messages", (recentMessages: Message[]) => {
      setMessages(recentMessages)
    })

    socket.emit("get-recent-messages", currentCity)

    return () => {
      socket.off("new-message")
      socket.off("recent-messages")
    }
  }, [socket, currentCity])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
          <span className="text-sm text-muted-foreground mt-2">
            This may take a few moments. If it persists, please refresh the page.
          </span>
        </CardContent>
      </Card>
    )
  }

  if (error || !currentCity) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Chat</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                {error || "Unable to load your city information. Please check your profile settings."}
              </p>
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

