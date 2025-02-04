"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Message = {
  _id: string
  content: string
  username: string
  createdAt: string
}

type City = {
  _id: string
  name: string
}

export default function CommunityChat() {
  const [cities, setCities] = useState<City[]>([])
  const [city, setCity] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>("")

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))

    const storedCity = localStorage.getItem("city")
    const storedUsername = localStorage.getItem("username")
    if (storedCity && storedUsername) {
      setCity(storedCity)
      setUsername(storedUsername)
      setIsJoined(true)
      fetchMessages(storedCity)
    }
  }, [])

  const fetchMessages = async (cityName: string) => {
    const res = await fetch(`/api/messages?city=${cityName}`)
    const data = await res.json()
    setMessages(data)
  }

  const handleJoin = () => {
    if (city && username) {
      localStorage.setItem("city", city)
      localStorage.setItem("username", username)
      setIsJoined(true)
      fetchMessages(city)
    }
  }

  const handleLeave = () => {
    localStorage.removeItem("city")
    localStorage.removeItem("username")
    setCity("")
    setUsername("")
    setIsJoined(false)
    setMessages([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input, username, city }),
      })
      if (res.ok) {
        setInput("")
        fetchMessages(city)
      }
    }
  }

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join Community Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setCity(value)}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city._id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleJoin} disabled={!city || !username}>
              Join Chat
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{city} Community Chat</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome, {username}!</p>
          <Button onClick={handleLeave} variant="outline" className="mt-2">
            Leave Chat
          </Button>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto">
          {messages.map((message: Message) => (
            <div key={message._id} className={`mb-4 ${message.username === username ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.username === username ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                <strong>{message.username}: </strong>
                {message.content}
              </span>
              <div className="text-xs text-gray-500 mt-1">{new Date(message.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </footer>
    </div>
  )
}

