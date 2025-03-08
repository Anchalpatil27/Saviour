"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { addEmergencyContact } from "@/lib/actions/emergency-contact-actions"
import { useToast } from "@/hooks/use-toast"

interface EmergencyContactFormProps {
  userId: string
}

export function EmergencyContactForm({ userId }: EmergencyContactFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    phoneNumber: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await addEmergencyContact({
        ...formData,
        userId, // Pass the userId directly
      })

      if (result.success) {
        toast({
          title: "Contact added",
          description: "Emergency contact has been added successfully.",
        })
        // Reset form
        setFormData({
          name: "",
          relation: "",
          phoneNumber: "",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add contact",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Contact Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="relation">Relation</Label>
          <Input
            id="relation"
            name="relation"
            placeholder="Relation"
            value={formData.relation}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Phone Number"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        <Plus className="mr-2 h-4 w-4" /> {isLoading ? "Adding..." : "Add New Contact"}
      </Button>
    </form>
  )
}

