"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Ambulance, Truck, Shield } from "lucide-react"
import { EmergencyContactForm } from "@/components/emergency-contact-form"
import { EmergencyContactList } from "@/components/emergency-contact-list"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, onSnapshot } from "firebase/firestore"

type EmergencyContactDTO = {
  id: string
  name: string
  relation: string
  phoneNumber: string
  userId?: string
}

export default function EmergencyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userContacts, setUserContacts] = useState<EmergencyContactDTO[]>([])
  const [loading, setLoading] = useState(true)

  // Auth restriction
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) router.push("/auth/login")
      else setUser(firebaseUser)
    })
    return () => unsub()
  }, [router])

  // Real-time fetch user's emergency contacts from Firestore
  useEffect(() => {
    if (!user) return
    setLoading(true)
    const contactsRef = collection(db, "emergency_contacts")
    const q = query(contactsRef, where("userId", "==", user.uid))
    const unsub = onSnapshot(q, (snapshot) => {
      const contacts: EmergencyContactDTO[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        contacts.push({
          id: doc.id,
          name: data.name,
          relation: data.relation,
          phoneNumber: data.phoneNumber,
          userId: data.userId,
        })
      })
      setUserContacts(contacts)
      setLoading(false)
    })
    return () => unsub()
  }, [user])

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
          {loading ? (
            <div className="text-center py-4">Loading contacts...</div>
          ) : (
            <EmergencyContactList contacts={userContacts} userId={user?.uid} />
          )}
          {user && <EmergencyContactForm userId={user.uid} />}
        </CardContent>
      </Card>
    </div>
  )
}