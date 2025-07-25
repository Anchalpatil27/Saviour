"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, X } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"

type SOSRequest = {
  id: string
  emergencyType: string
  description: string
  urgency: "High" | "Medium" | "Low"
  isPublic: boolean
  senderName?: string
  senderContact?: string
  address?: string
}

type SOSEditModalProps = {
  visible: boolean
  sosRequest: SOSRequest | null
  onClose: () => void
  onUpdate: () => void
}

export default function SOSEditModal({
  visible,
  sosRequest,
  onClose,
  onUpdate,
}: SOSEditModalProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<SOSRequest>>({
    emergencyType: "",
    description: "",
    urgency: "Medium",
    isPublic: true,
    senderName: "",
    senderContact: "",
    address: "",
  })

  useEffect(() => {
    if (sosRequest) {
      setFormData({
        emergencyType: sosRequest.emergencyType,
        description: sosRequest.description,
        urgency: sosRequest.urgency,
        isPublic: sosRequest.isPublic,
        senderName: sosRequest.senderName || "",
        senderContact: sosRequest.senderContact || "",
        address: sosRequest.address || "",
      })
    }
  }, [sosRequest])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sosRequest?.id) return

    setLoading(true)
    try {
      await updateDoc(doc(db, "sos_requests", sosRequest.id), {
        ...formData,
        updatedAt: new Date(),
      })
      
      // Success notification
      showToast({
        title: "Success",
        description: "SOS request updated successfully",
        variant: "default",
      })
      
      onUpdate()
      onClose()
    } catch (error) {
      console.error("Error updating SOS request:", error)
      // Error notification
      showToast({
        title: "Error",
        description: "Failed to update SOS request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Emergency Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyType">Emergency Type</Label>
              <Input
                id="emergencyType"
                name="emergencyType"
                value={formData.emergencyType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={(e) => handleSelectChange("urgency", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Your Name</Label>
              <Input
                id="senderName"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderContact">Contact Info</Label>
              <Input
                id="senderContact"
                name="senderContact"
                value={formData.senderContact}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address/Location Details</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}