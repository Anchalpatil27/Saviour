"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CityFilterProps {
  adminCity: string
}

export function CityFilter({ adminCity }: CityFilterProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          City Access Control
        </CardTitle>
        <CardDescription>You have access to manage data for your city</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            {adminCity}
          </Badge>
          <p className="text-sm text-muted-foreground">
            You can only manage data for <span className="font-medium">{adminCity}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

