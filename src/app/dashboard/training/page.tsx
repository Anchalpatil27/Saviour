import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, Award, Clock, Calendar, Users } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default async function TrainingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const courses = [
    { title: "Disaster Preparedness 101", type: "Online Course", duration: "2 hours", progress: 75 },
    { title: "Emergency Response Techniques", type: "Video Series", duration: "3 hours", progress: 30 },
    { title: "First Aid Certification", type: "In-Person Workshop", duration: "1 day", progress: 0 },
  ]

  const upcomingWorkshops = [
    { title: "Community First Aid", date: "2023-07-15", capacity: "20/30" },
    { title: "Fire Safety at Home", date: "2023-07-22", capacity: "15/25" },
    { title: "Earthquake Preparedness", date: "2023-07-29", capacity: "25/30" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Training & Workshops</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                {course.type === "Online Course" && <BookOpen className="mr-2 h-5 w-5" />}
                {course.type === "Video Series" && <Video className="mr-2 h-5 w-5" />}
                {course.type === "In-Person Workshop" && <Users className="mr-2 h-5 w-5" />}
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-2 text-sm">{course.type}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="mr-1" size={16} />
                <span>{course.duration}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
              <Button className="w-full mt-4">
                {course.progress > 0 ? "Continue" : "Start"} Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upcoming Live Workshops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingWorkshops.map((workshop, index) => (
              <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <h3 className="font-semibold">{workshop.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(workshop.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{workshop.capacity} seats</Badge>
                  <Button size="sm">Register</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Certification Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm">Enhance your skills and get certified in various aspects of disaster management.</p>
          <ul className="space-y-2 mb-4">
            <li className="flex justify-between items-center">
              <span className="text-sm">Emergency Response Coordinator</span>
              <Badge>Advanced</Badge>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Disaster Risk Assessment Specialist</span>
              <Badge>Intermediate</Badge>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Community Resilience Planner</span>
              <Badge>Beginner</Badge>
            </li>
          </ul>
          <Button className="w-full">View All Certification Programs</Button>
        </CardContent>
      </Card>
    </div>
  )
}

