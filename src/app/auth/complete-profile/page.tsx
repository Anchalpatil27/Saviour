"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormData {
  email: string | null
  name: string | null
  image: string | null
  username: string
  password: string
  phoneNumber: string
  address: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

export default function CompleteProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const email = searchParams.get("email")
  const name = searchParams.get("name")
  const image = searchParams.get("image")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)

    const formData = new FormData(event.currentTarget)
    const data: FormData = {
      email,
      name,
      image,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      address: formData.get("address") as string,
      emergencyContact: {
        name: formData.get("emergencyContactName") as string,
        phone: formData.get("emergencyContactPhone") as string,
        relationship: formData.get("emergencyContactRelationship") as string,
      },
    }

    // Basic validation
    if (!data.username || !data.phoneNumber || !data.address) {
      setFormError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to complete profile")
      }

      toast.showToast({
        title: "Profile completed",
        description: "Your profile has been successfully created. Redirecting to dashboard...",
      })

      // Short delay before redirect to show the success message
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete your profile"
      setFormError(errorMessage)
      toast.showToast({
        title: "Error",
        description: errorMessage,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide additional information to complete your registration. All fields are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Choose a Username"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+91 0000000000"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Your full address"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Emergency Contact</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      placeholder="Full name"
                      required
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      type="tel"
                      placeholder="+91 0000000000"
                      required
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                    <Input
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      placeholder="e.g., Parent, Spouse, Sibling"
                      required
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <CardFooter className="px-0">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
