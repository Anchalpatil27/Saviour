import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Package, Truck, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default async function SupplyChainPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const supplies = [
    { name: 'Food Supplies', stock: 75, nextDelivery: '2 days', trend: 'up' },
    { name: 'Medical Supplies', stock: 60, nextDelivery: '1 day', trend: 'down' },
    { name: 'Water', stock: 90, nextDelivery: '5 days', trend: 'stable' },
  ]

  const shipments = [
    { id: '12345', status: 'In Transit', eta: '6 hours' },
    { id: '67890', status: 'Scheduled', eta: '2 days' },
    { id: '54321', status: 'Delayed', eta: 'Unknown' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Supply Chain Tracking</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {supplies.map((supply, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  {supply.name}
                </span>
                {supply.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                {supply.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                {supply.trend === 'stable' && <TrendingUp className="h-4 w-4 text-yellow-500 transform rotate-90" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Current stock:</p>
                <div className="flex items-center">
                  <Progress value={supply.stock} className="flex-grow mr-2" />
                  <span className="text-sm font-medium">{supply.stock}%</span>
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  Next delivery: {supply.nextDelivery}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Active Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="flex justify-between items-center">
                <span className="text-sm font-medium">Shipment #{shipment.id}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    shipment.status === 'In Transit' ? 'default' :
                    shipment.status === 'Scheduled' ? 'secondary' : 'destructive'
                  }>
                    {shipment.status}
                  </Badge>
                  <span className="text-sm text-gray-500">ETA: {shipment.eta}</span>
                </div>
              </div>
            ))}
            <Button className="w-full">View All Shipments</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supply Chain Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-gray-600">Supply Chain Map Placeholder</span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button className="flex-1">View Detailed Analytics</Button>
            <Button variant="outline" className="flex-1">Export Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

