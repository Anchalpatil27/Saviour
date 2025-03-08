"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Send, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { sendMessage, getCityMessages, type MessageInterface } from "@/lib/actions/message-actions"

interface CommunityProps {
  userId: string
  userCity: string | undefined
  userName?: string // Add userName prop
}

export function CommunityChat({ userId, userCity, userName = "User" }: CommunityProps) {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeUsers, setActiveUsers] = useState<number>(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch messages for the user's city
  useEffect(() => {
    if (!userCity) {
      return
    }

    const fetchMessages = async () => {
      try {
        const cityMessages = await getCityMessages(userCity)
        setMessages(cityMessages)

        // Simulate active users count (in a real app, this would come from the server)
        setActiveUsers(Math.floor(Math.random() * 5) + 3)
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      }
    }

    fetchMessages()

    // Set up polling for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [userCity])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || loading || !userCity) return

    setLoading(true)

    try {
      await sendMessage({
        content: newMessage,
        userId,
        city: userCity,
      })

      setNewMessage("")

      // Focus the input field after sending
      if (inputRef.current) {
        inputRef.current.focus()
      }

      // Optimistically update the UI with the actual user name
      const optimisticMessage: MessageInterface = {
        id: Date.now().toString(),
        content: newMessage,
        userId,
        userName, // Use the actual userName instead of "You"
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, optimisticMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setLoading(false)
    }
  }

  // Format date in a clear, unambiguous way
  const formatMessageDate = (date: Date): string => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const messageDate = new Date(date)

    // Check if it's today
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today"
    }

    // Check if it's yesterday
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }

    // Otherwise, use a clear date format with month name
    return messageDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = formatMessageDate(new Date(message.createdAt))
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, MessageInterface[]>,
  )

  // If no city is set, show a message
  if (!userCity) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">You need to set your city to join the community chat.</p>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[400px] flex flex-col border shadow-md rounded-xl overflow-hidden">
      <CardHeader className="px-4 py-2 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
                {activeUsers}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-sm flex items-center gap-2">
                {userCity} Community
                <Badge variant="outline" className="ml-1 text-[10px] font-normal py-0 px-1.5 h-4">
                  Local
                </Badge>
              </h3>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[300px]" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium mb-1">No messages yet</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Be the first to start a conversation with people in {userCity}!
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                      {date}
                    </span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>

                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.userId === userId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-1.5 max-w-[80%] ${message.userId === userId ? "flex-row-reverse" : ""}`}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-6 w-6 shrink-0">
                                <AvatarImage src={message.userImage} />
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                  {message.userName?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{message.userName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div>
                          <div
                            className={`rounded-2xl px-3 py-1.5 text-xs ${
                              message.userId === userId ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                          <p className="text-[9px] text-muted-foreground mt-0.5">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-2 border-t bg-card">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-muted border-0 focus-visible:ring-1 h-8 text-xs"
            disabled={loading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={loading || !newMessage.trim()}
            className={`h-8 text-xs ${!newMessage.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

