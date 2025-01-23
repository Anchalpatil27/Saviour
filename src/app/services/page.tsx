import { Metadata } from 'next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AlertTriangle, Navigation, Users, Database, BookOpen, BarChart2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Services - SAVIOUR',
  description: 'Explore the range of disaster management services offered by SAVIOUR',
}

const services = [
  {
    title: "Real-Time Alerts",
    description: "Receive instant notifications about emergencies and critical updates in your area, ensuring you're always informed and prepared.",
    icon: AlertTriangle
  },
  {
    title: "Navigation Assistance",
    description: "Get guided routes to the nearest safe zones and emergency services, helping you reach safety quickly and efficiently.",
    icon: Navigation
  },
  {
    title: "Resource Tracking",
    description: "Access up-to-date information on the availability of essential supplies and resources in your vicinity during crisis situations.",
    icon: Database
  },
  {
    title: "Community Support Network",
    description: "Connect with local volunteers and organizations to offer or receive help during emergencies, fostering a spirit of community resilience.",
    icon: Users
  },
  {
    title: "Emergency Preparedness Training",
    description: "Access online courses and resources to improve your disaster preparedness skills and knowledge.",
    icon: BookOpen
  },
  {
    title: "Data Analytics and Reporting",
    description: "Gain insights from historical and real-time data to improve disaster response strategies and resource allocation.",
    icon: BarChart2
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/services-texture.svg')] opacity-10"></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-5xl font-bold mb-12 text-center text-blue-800">Our Services</h1>
        <p className="text-xl text-center mb-16 max-w-3xl mx-auto">
          At SAVIOUR, we offer a comprehensive suite of disaster management services designed to help communities prepare for, respond to, and recover from emergencies. Explore our services below:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pop-out" style={{animationDelay: `${index * 100}ms`}}>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-blue-800">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
