import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Bell, AlertTriangle, CheckCircle, Users, BarChart, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default async function Dashboard() {
 const session = await getServerSession(authOptions)

 if (!session) {
   redirect('/auth/login')
 }

 return (
   <div className="space-y-6">
     <h2 className="text-3xl font-bold mb-6 text-indigo-800">Dashboard Overview</h2>
     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
       <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
           <Bell className="h-4 w-4 text-blue-100" />
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">3</div>
           <p className="text-xs text-blue-100">+2 since last week</p>
         </CardContent>
       </Card>
       <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">Resource Availability</CardTitle>
           <AlertTriangle className="h-4 w-4 text-purple-100" />
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">78%</div>
           <Progress value={78} className="mt-2 bg-purple-300 [&>div]:bg-white" />
         </CardContent>
       </Card>
       <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">Community Engagement</CardTitle>
           <Users className="h-4 w-4 text-green-100" />
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">2,345</div>
           <p className="text-xs text-green-100">Active community members</p>
         </CardContent>
       </Card>
       <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">Safety Status</CardTitle>
           <CheckCircle className="h-4 w-4 text-yellow-100" />
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">Safe</div>
           <p className="text-xs text-yellow-100">No immediate threats detected</p>
         </CardContent>
       </Card>
     </div>
     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
       <Card className="col-span-4 bg-white shadow-lg">
         <CardHeader>
           <CardTitle className="flex items-center text-indigo-800">
             <BarChart className="mr-2 h-5 w-5" />
             Resource Utilization
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="h-[200px] bg-gradient-to-r from-indigo-50 to-blue-50 rounded-md flex items-center justify-center">
             Resource Utilization Chart Placeholder
           </div>
         </CardContent>
       </Card>
       <Card className="col-span-3 bg-white shadow-lg">
         <CardHeader>
           <CardTitle className="flex items-center text-indigo-800">
             <TrendingUp className="mr-2 h-5 w-5" />
             Incident Trends
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="h-[200px] bg-gradient-to-r from-purple-50 to-pink-50 rounded-md flex items-center justify-center">
             Incident Trends Chart Placeholder
           </div>
         </CardContent>
       </Card>
     </div>
     <Card className="bg-white shadow-lg">
       <CardHeader>
         <CardTitle className="text-indigo-800">Recent Alerts</CardTitle>
       </CardHeader>
       <CardContent>
         <Alert className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
           <AlertTriangle className="h-4 w-4 text-red-600" />
           <AlertTitle className="text-red-800">Severe Weather Warning</AlertTitle>
           <AlertDescription className="text-red-700">
             Heavy rainfall expected in the next 24 hours. Potential for localized flooding.
           </AlertDescription>
         </Alert>
       </CardContent>
     </Card>
     <Card className="bg-white shadow-lg">
       <CardHeader>
         <CardTitle className="text-indigo-800">Quick Actions</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="flex flex-wrap gap-4">
           <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">View Evacuation Routes</Button>
           <Button variant="outline" className="border-indigo-500 text-indigo-700 hover:bg-indigo-50">Update Emergency Contacts</Button>
           <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">Check Supply Inventory</Button>
           <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">Report an Incident</Button>
         </div>
       </CardContent>
     </Card>
   </div>
 )
}

