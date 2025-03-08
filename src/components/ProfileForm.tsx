"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfile } from "@/lib/actions/profile-actions"

interface ProfileFormProps {
  initialData: {
    name: string | null
    email: string | null
    city: string | null
  } | null
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(initialData?.name || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [city, setCity] = useState(initialData?.city || "")
  const [error, setError] = useState("")

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await updateProfile({
        name: name || "",
        email: email || "",
        city: city || null,
      })

      if (result.success) {
        // Show success message
        alert("Profile updated successfully")
        router.refresh() // Refresh the page to show updated data
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              disabled
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <Input id="city" value={city || ""} onChange={(e) => setCity(e.target.value)} placeholder="Your city" />
            <p className="text-xs text-muted-foreground">
              Enter your city to join community chats with people in your area
            </p>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

