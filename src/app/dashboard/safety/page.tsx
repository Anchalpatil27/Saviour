import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, BookOpen, Stethoscope, AlertTriangle } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

export default async function SafetyPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const safetyTips = [
    { title: "Create an emergency kit", description: "Include water, non-perishable food, first aid supplies, and important documents." },
    { title: "Develop a family communication plan", description: "Ensure all family members know how to contact each other and where to meet in case of emergency." },
    { title: "Know your evacuation routes", description: "Familiarize yourself with multiple evacuation routes from your home and workplace." },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Safety Guidelines</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Emergency Preparedness
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="list-disc pl-5 mb-4 space-y-2 text-sm">
              {safetyTips.map((tip, index) => (
                <li key={index}>
                  <strong>{tip.title}:</strong> {tip.description}
                </li>
              ))}
            </ul>
            <Button className="w-full">Learn More</Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Safety Training Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Basic First Aid</span>
                  <span>80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fire Safety</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Natural Disaster Response</span>
                  <span>40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
            <Button className="w-full mt-4">Continue Training</Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="mr-2 h-5 w-5" />
              First Aid Basics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                Learn CPR techniques
              </li>
              <li className="flex items-center text-sm">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                Treat burns and wounds
              </li>
              <li className="flex items-center text-sm">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                Recognize signs of shock
              </li>
            </ul>
            <Button className="w-full">Take First Aid Course</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

