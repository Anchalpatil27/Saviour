"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserDetails } from "@/types/user"

export function UpdateProfileForm({ userDetails }: { userDetails: UserDetails }) {
  const [formData, setFormData] = useState(userDetails)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        alert("Profile updated successfully")
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" className="text-sm sm:text-base">
            Name
          </Label>
          <Input id="name" value={formData.name} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm sm:text-base">
            Email
          </Label>
          <Input id="email" type="email" value={formData.email} className="mt-1" readOnly />
        </div>
      </div>
      <div>
        <Label htmlFor="phone" className="text-sm sm:text-base">
          Phone
        </Label>
        <Input id="phone" type="tel" value={formData.phone || ""} onChange={handleChange} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="address" className="text-sm sm:text-base">
          Address
        </Label>
        <Input id="address" value={formData.address || ""} onChange={handleChange} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="city" className="text-sm sm:text-base">
          City
        </Label>
        <Input id="city" value={formData.city || ""} onChange={handleChange} className="mt-1" />
      </div>
      <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base">
        Update Profile
      </Button>
    </form>
  )
}

