import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Ambulance, Truck, Shield } from "lucide-react"
import { EmergencyContactForm } from "@/components/emergency-contact-form"
import { EmergencyContactList } from "@/components/emergency-contact-list"
import { connectToMongoDB } from "@/lib/mongodb"
import type { EmergencyContactDTO } from "@/lib/models/emergency-contact"

// Move the server function logic directly into the page component
async function getContacts(userId: string): Promise<EmergencyContactDTO[]> {
  try {
    const { db } = await connectToMongoDB()

    // Get emergency contacts for the user
    const contacts = await db.collection("emergencyContacts").find({ userId }).sort({ createdAt: -1 }).toArray()

    // Map to DTO
    return contacts.map((contact) => ({
      id: contact._id.toString(),
      name: contact.name,
      relation: contact.relation,
      phoneNumber: contact.phoneNumber,
    }))
  } catch (error) {
    console.error("Error fetching emergency contacts:", error)
    return []
  }
}

export default async function EmergencyPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    redirect("/auth/login")
  }

  // This ensures TypeScript knows that session.user and session.user.email are defined

  // Get user ID
  const { db } = await connectToMongoDB()
  const user = await db.collection("users").findOne({ email: session.user.email })
  const userId = user ? user._id.toString() : ""

  // Fetch user's emergency contacts directly
  const userContacts = await getContacts(userId)

  const emergencyContacts = [
    { name: "Emergency Services", number: "112", icon: Phone },
    { name: "Local Police", number: "100", icon: Shield },
    { name: "Fire Department", number: "101", icon: Truck },
    { name: "Ambulance", number: "102", icon: Ambulance },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Emergency Contacts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {emergencyContacts.map((contact) => (
          <Card key={contact.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <contact.icon className="mr-2 h-5 w-5" />
                {contact.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-2xl font-bold mb-4">{contact.number}</p>
              <Button className="w-full" asChild>
                <a href={`tel:${contact.number}`}>Call Now</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <EmergencyContactList contacts={userContacts} />
          <EmergencyContactForm userId={userId} />
        </CardContent>
      </Card>
    </div>
  )
}

