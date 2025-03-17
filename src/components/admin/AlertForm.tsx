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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  type: z.string({
    required_error: "Please select an alert type.",
  }),
  severity: z.string({
    required_error: "Please select a severity level.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  city: z.string().optional(),
  active: z.boolean().default(false),
  expiresAt: z.date().optional().nullable(),
})

type AlertFormValues = z.infer<typeof formSchema>

interface AlertFormProps {
  alert?: {
    id: string
    title: string
    type: string
    severity: string
    message: string
    city: string
    active: boolean
    expiresAt: Date | null
  }
}

export function AlertForm({ alert }: AlertFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adminSetupRequired, setAdminSetupRequired] = useState(false)

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: alert
      ? {
          title: alert.title,
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          city: alert.city,
          active: alert.active,
          expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : null,
        }
      : {
          title: "",
          type: "weather",
          severity: "medium",
          message: "",
          city: "",
          active: false,
          expiresAt: null,
        },
  })

  async function onSubmit(values: AlertFormValues) {
    setIsSubmitting(true)
    setError(null)
    setAdminSetupRequired(false)

    try {
      const url = alert ? `/api/admin/alerts/${alert.id}` : "/api/admin/alerts"

      const method = alert ? "PUT" : "POST"

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
        throw new Error(data.error || "Failed to save alert")
      }

      // Redirect back to alerts list
      router.push("/admin/alerts")
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

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Flood Warning" {...field} />
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
                <FormLabel>Alert Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="evacuation">Evacuation</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="info">Informational</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed alert message..." className="min-h-[120px]" {...field} />
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
              <FormLabel>City (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Leave blank for all cities" {...field} />
              </FormControl>
              <FormDescription>
                Specify a city to target this alert, or leave blank to send to all users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiration Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : "Select expiration date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Alert will automatically deactivate after this date. Leave blank for no expiration.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Activate Alert</FormLabel>
                <FormDescription>Immediately publish this alert to users.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/alerts")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {alert ? "Update Alert" : "Create Alert"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

