"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Message = {
  id: string
  content: string
  username: string
  city: string
  createdAt: string
}

type CommunityProps = {
  userCity: string | null
}

export function CommunityChat({ userCity }: CommunityProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userCity) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [userCity])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef]) //Corrected dependency

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages")
      if (!res.ok) {
        throw new Error("Failed to fetch messages")
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      setError("Failed to load messages")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && userCity) {
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: input }),
        })
        if (!res.ok) {
          throw new Error("Failed to post message")
        }
        setInput("")
        fetchMessages()
      } catch (error) {
        console.error("Error posting message:", error)
        setError("Failed to send message")
      }
    }
  }

  if (!userCity) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Unable to determine your city. Please ensure your profile has a city set and contact support if the issue
          persists.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{userCity} Community Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4" ref={scrollAreaRef}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="font-semibold">{message.username}</div>
              <div>{message.content}</div>
              <div className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  )
}

