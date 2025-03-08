"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteEmergencyContact } from "@/lib/actions/emergency-contact-actions"
import type { EmergencyContactDTO } from "@/lib/models/emergency-contact"

interface EmergencyContactListProps {
  contacts: EmergencyContactDTO[]
  userId?: string
}

export function EmergencyContactList({ contacts, userId }: EmergencyContactListProps) {
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`
  }

  const handleDelete = async (id: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is required to delete contacts",
        variant: "destructive",
      })
      return
    }

    setDeletingId(id)

    try {
      const result = await deleteEmergencyContact(id, userId)

      if (result.success) {
        toast({
          title: "Contact deleted",
          description: "Emergency contact has been removed.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete contact",
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
      setDeletingId(null)
    }
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No emergency contacts added yet.</p>
        <p className="text-sm">Add your first contact using the form below.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-4 mb-4">
      {contacts.map((contact) => (
        <li key={contact.id} className="flex items-center border-b pb-2">
          <div className="flex-1">
            <p className="font-medium">{contact.name}</p>
            <p className="text-sm text-muted-foreground">
              {contact.relation} • {contact.phoneNumber}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleCall(contact.phoneNumber)}>
              Call
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(contact.id)}
              disabled={deletingId === contact.id}
            >
              {deletingId === contact.id ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

