"use server"

import { revalidatePath } from "next/cache"
import { connectToMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface AddContactProps {
  name: string
  relation: string
  phoneNumber: string
  userId: string // Now we receive userId directly
}

export async function addEmergencyContact({ name, relation, phoneNumber, userId }: AddContactProps) {
  try {
    // Create new emergency contact
    const { db } = await connectToMongoDB()
    const newContact = {
      userId,
      name,
      relation,
      phoneNumber,
      createdAt: new Date(),
    }

    await db.collection("emergencyContacts").insertOne(newContact)

    revalidatePath("/dashboard/emergency")
    return { success: true }
  } catch (error) {
    console.error("Error adding emergency contact:", error)
    return { success: false, error: "Failed to add emergency contact" }
  }
}

export async function deleteEmergencyContact(contactId: string, userId: string) {
  try {
    const { db } = await connectToMongoDB()

    // Delete the contact, ensuring it belongs to the current user
    const result = await db.collection("emergencyContacts").deleteOne({
      _id: new ObjectId(contactId),
      userId,
    })

    if (result.deletedCount === 0) {
      return { success: false, error: "Contact not found or not authorized" }
    }

    revalidatePath("/dashboard/emergency")
    return { success: true }
  } catch (error) {
    console.error("Error deleting emergency contact:", error)
    return { success: false, error: "Failed to delete emergency contact" }
  }
}

