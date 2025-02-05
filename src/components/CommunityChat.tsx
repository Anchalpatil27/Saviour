"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  userId: string
  userName: string
  city: string
  createdAt: Date
}

interface CommunityChatProps {
  userCity: string | null
}

export function CommunityChat({ userCity }: CommunityChatProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMessages() {
      if (!userCity) {
        setError("Unable to determine your city. Please set your city in your profile.")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/messages?city=${encodeURIComponent(userCity)}`)
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to load messages")
        }
        const data = await response.json()
        setMessages(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load messages. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchMessages()
    }
  }, [session, userCity])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userCity) return

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send message")
      }

      const newMessageData = await response.json()
      setMessages((prev) => [...prev, newMessageData])
      setNewMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!userCity) {
    return (
      <Card>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription className="flex flex-col gap-2">
              Unable to determine your city. Please set your city in your profile.
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

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Community Chat - {userCity}</CardTitle>
      </CardHeader>
      <CardContent>
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
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

