import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Ambulance, Truck, Shield, Plus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function EmergencyPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const emergencyContacts = [
    { name: 'Emergency Services', number: '112', icon: Phone },
    { name: 'Local Police', number: '100', icon: Shield },
    { name: 'Fire Department', number: '101', icon: Truck },
    { name: 'Ambulance', number: '102', icon: Ambulance },
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
              <Button className="w-full">Call Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 mb-4">
            <li className="flex justify-between items-center">
              <span className="text-sm">Dad</span>
              <Button variant="outline" size="sm">Call</Button>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Mom</span>
              <Button variant="outline" size="sm">Call</Button>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Brother</span>
              <Button variant="outline" size="sm">Call</Button>
            </li>
          </ul>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Contact Name" />
              </div>
              <div>
                <Label htmlFor="relation">Relation</Label>
                <Input id="relation" placeholder="Relation" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Phone Number" type="tel" />
            </div>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add New Contact
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

