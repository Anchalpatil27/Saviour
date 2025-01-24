"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function CompleteProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const email = searchParams.get("email")
  const name = searchParams.get("name")
  const image = searchParams.get("image")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      email,
      name,
      image,
      username: formData.get("username"),
      phoneNumber: formData.get("phoneNumber"),
      address: formData.get("address"),
      emergencyContact: {
        name: formData.get("emergencyContactName"),
        phone: formData.get("emergencyContactPhone"),
        relationship: formData.get("emergencyContactRelationship"),
      },
    }

    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to complete profile")
      }

      showToast({
        title: "Profile completed",
        description: "Your profile has been successfully created.",
      })

      router.push("/dashboard")
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to complete your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    router.push("/auth/signup")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Please provide additional information to complete your registration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" required />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" type="tel" required />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>

                <div>
                  <Label htmlFor="emergencyContactName">Contact Name</Label>
                  <Input id="emergencyContactName" name="emergencyContactName" required />
                </div>

                <div>
                  <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                  <Input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" required />
                </div>

                <div>
                  <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                  <Input id="emergencyContactRelationship" name="emergencyContactRelationship" required />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

