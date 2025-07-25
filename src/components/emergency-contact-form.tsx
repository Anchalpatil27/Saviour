"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

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
      await addDoc(collection(db, "emergency_contacts"), {
        ...formData,
        userId,
        createdAt: Timestamp.now(),
      })

      toast({
        title: "Contact added",
        description: "Emergency contact has been added successfully.",
      })
      setFormData({
        name: "",
        relation: "",
        phoneNumber: "",
      })
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "Failed to add contact",
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