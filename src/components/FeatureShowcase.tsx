import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  { title: "Real-Time Alerts", description: "Get instant notifications about disasters in your area." },
  { title: "Navigation Assistance", description: "Find the safest route to evacuation centers." },
  { title: "Resource Tracking", description: "Track availability of essential supplies in your vicinity." },
  { title: "Community Support", description: "Connect with others to offer or receive help during emergencies." },
]

export function FeatureShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {features.map((feature, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{feature.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

