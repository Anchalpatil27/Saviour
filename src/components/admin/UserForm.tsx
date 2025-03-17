"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  role: z.enum(["user", "admin"], {
    required_error: "Please select a role.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .optional()
    .or(z.literal("")),
})

type UserFormValues = z.infer<typeof formSchema>

interface UserFormProps {
  user?: {
    id: string
    name: string
    email: string
    city: string
    role: string
  }
  defaultCity?: string
  preserveCity?: string
}

export function UserForm({ user, defaultCity, preserveCity }: UserFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adminSetupRequired, setAdminSetupRequired] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          city: user.city,
          role: user.role as "user" | "admin",
          password: "", // Don't prefill password
        }
      : {
          name: "",
          email: "",
          city: defaultCity || "",
          role: "user",
          password: "",
        },
  })

  async function onSubmit(values: UserFormValues) {
    setIsSubmitting(true)
    setError(null)
    setAdminSetupRequired(false)

    try {
      const url = user ? `/api/admin/users/${user.id}` : "/api/admin/users"

      const method = user ? "PUT" : "POST"

      // If editing a user and password is empty, remove it from the request
      if (user && (!values.password || values.password.trim() === "")) {
        const { password, ...valuesWithoutPassword } = values
        values = valuesWithoutPassword as UserFormValues
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.adminSetupRequired) {
          setAdminSetupRequired(true)
          throw new Error("Admin profile not set up or city not found")
        }
        throw new Error(data.error || "Failed to save user")
      }

      // Preserve city filter when redirecting back
      const cityParam = preserveCity ? `?city=${preserveCity}` : ""

      // Redirect back to users list
      router.push(`/admin/users${cityParam}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    // Preserve city filter when canceling
    const cityParam = preserveCity ? `?city=${preserveCity}` : ""
    router.push(`/admin/users${cityParam}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
              {adminSetupRequired && (
                <div className="mt-2">
                  <Link href="/admin/setup-profile">
                    <Button variant="outline" size="sm">
                      Set Up Admin Profile
                    </Button>
                  </Link>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="New York" {...field} />
              </FormControl>
              <FormDescription>This will be automatically set to your admin city.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Admin users have full access to all features.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{user ? "New Password" : "Password"}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              {user && <FormDescription>Leave blank to keep the current password.</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

