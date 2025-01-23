import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Package, Droplet, Battery, Stethoscope, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default async function ResourceManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const resources = [
    { name: 'Food Supplies', icon: Package, level: 75, trend: 'up' },
    { name: 'Water', icon: Droplet, level: 60, trend: 'down' },
    { name: 'Power', icon: Battery, level: 90, trend: 'stable' },
    { name: 'Medical Supplies', icon: Stethoscope, level: 45, trend: 'down' },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Resource
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource) => (
          <Card key={resource.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <resource.icon className="mr-2 h-5 w-5" />
                  {resource.name}
                </span>
                {getTrendIcon(resource.trend)}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-2xl font-bold mb-2">{resource.level}%</div>
              <Progress value={resource.level} className="mb-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className={`font-medium ${
                  resource.level > 70 ? 'text-green-500' :
                  resource.level > 30 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {resource.level > 70 ? 'Sufficient' :
                   resource.level > 30 ? 'Moderate' : 'Low'}
                </span>
              </div>
              <Button className="w-full mt-4">Manage</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Resource Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-gray-500">Distribution Map Placeholder</span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button className="flex-1">View Detailed Report</Button>
            <Button variant="outline" className="flex-1">
              <Plus className="mr-2 h-4 w-4" /> Request Supplies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

