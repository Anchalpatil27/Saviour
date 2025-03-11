"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DisasterSafetyData } from "@/lib/actions/safety-actions"
import { Shield, Heart, AlertTriangle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SafetyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disasterType: string
  safetyData: DisasterSafetyData
  usingFallbackData?: boolean // Add this new prop
}

export function SafetyDialog({
  open,
  onOpenChange,
  disasterType,
  safetyData,
  usingFallbackData = false,
}: SafetyDialogProps) {
  const [activeTab, setActiveTab] = useState("before")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            {disasterType} Safety Guidelines
            <div className="ml-auto flex items-center gap-2">
              {usingFallbackData && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  Using Local Data
                </Badge>
              )}
              <Badge variant="outline">Complete Guide</Badge>
            </div>
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
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-4 border border-amber-100 dark:border-amber-900">
              <h3 className="text-lg font-medium mb-3 flex items-center text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {safetyData.beforeDisaster.title}
              </h3>
              <ul className="grid gap-3">
                {safetyData.beforeDisaster.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 h-6 w-6 text-sm mr-3 shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="during" className="space-y-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-100 dark:border-blue-900">
              <h3 className="text-lg font-medium mb-3 flex items-center text-blue-800 dark:text-blue-300">
                <Shield className="h-5 w-5 mr-2" />
                {safetyData.duringDisaster.title}
              </h3>
              <ul className="grid gap-3">
                {safetyData.duringDisaster.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 h-6 w-6 text-sm mr-3 shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="after" className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-100 dark:border-green-900">
              <h3 className="text-lg font-medium mb-3 flex items-center text-green-800 dark:text-green-300">
                <CheckCircle className="h-5 w-5 mr-2" />
                {safetyData.afterDisaster.title}
              </h3>
              <ul className="grid gap-3">
                {safetyData.afterDisaster.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 h-6 w-6 text-sm mr-3 shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="firstaid" className="space-y-4">
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900">
              <h3 className="text-lg font-medium mb-3 flex items-center text-red-800 dark:text-red-300">
                <Heart className="h-5 w-5 mr-2" />
                {safetyData.firstAid.title}
              </h3>
              <ul className="grid gap-3">
                {safetyData.firstAid.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 h-6 w-6 text-sm mr-3 shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

