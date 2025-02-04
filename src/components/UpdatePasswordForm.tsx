"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UpdatePasswordForm({ userEmail }: { userEmail: string }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match")
      return
    }
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, ...passwords }),
      })
      if (res.ok) {
        alert("Password updated successfully")
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        throw new Error("Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      alert("Failed to update password")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword" className="text-sm sm:text-base">
          Current Password
        </Label>
        <Input
          id="currentPassword"
          type="password"
          value={passwords.currentPassword}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="newPassword" className="text-sm sm:text-base">
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={passwords.newPassword}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword" className="text-sm sm:text-base">
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={passwords.confirmPassword}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base">
        Change Password
      </Button>
    </form>
  )
}

