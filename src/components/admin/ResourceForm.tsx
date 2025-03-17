"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
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
  type: z.string({
    required_error: "Please select a resource type.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  contact: z.string().optional(),
  available: z.boolean().default(true),
})

type ResourceFormValues = z.infer<typeof formSchema>

interface ResourceFormProps {
  resource?: {
    id: string
    name: string
    type: string
    description: string
    location: string
    city: string
    contact: string
    available: boolean
  }
}

export function ResourceForm({ resource }: ResourceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adminSetupRequired, setAdminSetupRequired] = useState(false)

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: resource
      ? {
          name: resource.name,
          type: resource.type,
          description: resource.description,
          location: resource.location,
          city: resource.city,
          contact: resource.contact,
          available: resource.available,
        }
      : {
          name: "",
          type: "shelter",
          description: "",
          location: "",
          city: "",
          contact: "",
          available: true,
        },
  })

  async function onSubmit(values: ResourceFormValues) {
    setIsSubmitting(true)
    setError(null)
    setAdminSetupRequired(false)

    try {
      const url = resource ? `/api/admin/resources/${resource.id}` : "/api/admin/resources"

      const method = resource ? "PUT" : "POST"

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
        throw new Error(data.error || "Failed to save resource")
      }

      // Redirect back to resources list
      router.push("/admin/resources")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
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

        {/* Form fields remain the same */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Emergency Shelter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="shelter">Shelter</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="evacuation">Evacuation</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
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
        </div>

        {/* Rest of the form fields remain the same */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description of the resource..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, New York, NY 10001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Information (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Phone: (555) 123-4567, Email: contact@example.com" {...field} />
              </FormControl>
              <FormDescription>Provide contact details for this resource.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Available</FormLabel>
                <FormDescription>Mark this resource as currently available.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/resources")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {resource ? "Update Resource" : "Add Resource"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

