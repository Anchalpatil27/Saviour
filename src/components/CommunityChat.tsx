"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  content: string
  username: string
  city: string
  createdAt: string
}

export function CommunityChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity")
    if (storedCity) {
      setSelectedCity(storedCity)
      fetchMessages(storedCity)
    }

    const interval = setInterval(() => {
      const currentCity = localStorage.getItem("selectedCity")
      if (currentCity) {
        fetchMessages(currentCity)
      }
    }, 5000) // Fetch messages every 5 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef]) //Corrected dependency

  const fetchMessages = async (city: string) => {
    try {
      const res = await fetch(`/api/messages?city=${city}`)
      if (!res.ok) {
        throw new Error("Failed to fetch messages")
      }
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && selectedCity) {
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: input, city: selectedCity }),
        })
        if (!res.ok) {
          throw new Error("Failed to post message")
        }
        setInput("")
        fetchMessages(selectedCity)
      } catch (error) {
        console.error("Error posting message:", error)
      }
    }
  }

  if (!selectedCity) {
    return <div>Please select a city to join the chat.</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{selectedCity} Community Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4" ref={scrollAreaRef}>
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

