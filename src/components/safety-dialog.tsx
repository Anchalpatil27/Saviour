"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DisasterSafetyData } from "@/lib/actions/safety-actions"
import { Shield, Heart, AlertTriangle, CheckCircle } from "lucide-react"

interface SafetyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disasterType: string
  safetyData: DisasterSafetyData
}

export function SafetyDialog({ open, onOpenChange, disasterType, safetyData }: SafetyDialogProps) {
  const [activeTab, setActiveTab] = useState("before")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            {disasterType} Safety Guidelines
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="before" className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Before</span>
            </TabsTrigger>
            <TabsTrigger value="during" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">During</span>
            </TabsTrigger>
            <TabsTrigger value="after" className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">After</span>
            </TabsTrigger>
            <TabsTrigger value="firstaid" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">First Aid</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="before" className="space-y-4">
            <h3 className="text-lg font-medium">{safetyData.beforeDisaster.title}</h3>
            <ul className="space-y-2">
              {safetyData.beforeDisaster.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="during" className="space-y-4">
            <h3 className="text-lg font-medium">{safetyData.duringDisaster.title}</h3>
            <ul className="space-y-2">
              {safetyData.duringDisaster.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="after" className="space-y-4">
            <h3 className="text-lg font-medium">{safetyData.afterDisaster.title}</h3>
            <ul className="space-y-2">
              {safetyData.afterDisaster.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="firstaid" className="space-y-4">
            <h3 className="text-lg font-medium">{safetyData.firstAid.title}</h3>
            <ul className="space-y-2">
              {safetyData.firstAid.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Heart className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

