"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Stethoscope } from "lucide-react"
import type { DisasterSafetyData } from "@/lib/actions/safety-actions"

interface SafetyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  safetyData: DisasterSafetyData
}

export function SafetyDialog({ open, onOpenChange, safetyData }: SafetyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            {safetyData.disasterType} Safety Guidelines
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="before" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="before">Before</TabsTrigger>
            <TabsTrigger value="during">During</TabsTrigger>
            <TabsTrigger value="after">After</TabsTrigger>
          </TabsList>

          <TabsContent value="before" className="space-y-4">
            <h3 className="text-lg font-medium">Before a {safetyData.disasterType}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {safetyData.beforeTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="during" className="space-y-4">
            <h3 className="text-lg font-medium">During a {safetyData.disasterType}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {safetyData.duringTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="after" className="space-y-4">
            <h3 className="text-lg font-medium">After a {safetyData.disasterType}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {safetyData.afterTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-blue-500" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Stethoscope className="mr-2 h-5 w-5" />
            First Aid for {safetyData.disasterType} Situations
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {safetyData.firstAidTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Stethoscope className="mr-2 h-4 w-4 text-green-500" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

