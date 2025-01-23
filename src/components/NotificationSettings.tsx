'use client'

import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Bell, Smartphone, Mail, AlertTriangle } from 'lucide-react'

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    emergencyAlerts: true,
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <Label htmlFor="push-notifications">Push Notifications</Label>
          </div>
          <Switch
            id="push-notifications"
            checked={settings.pushNotifications}
            onCheckedChange={() => handleToggle('pushNotifications')}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <Label htmlFor="email-notifications">Email Notifications</Label>
          </div>
          <Switch
            id="email-notifications"
            checked={settings.emailNotifications}
            onCheckedChange={() => handleToggle('emailNotifications')}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
          </div>
          <Switch
            id="sms-notifications"
            checked={settings.smsNotifications}
            onCheckedChange={() => handleToggle('smsNotifications')}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
          </div>
          <Switch
            id="emergency-alerts"
            checked={settings.emergencyAlerts}
            onCheckedChange={() => handleToggle('emergencyAlerts')}
          />
        </div>
      </div>
      <Button className="w-full sm:w-auto">Save Notification Settings</Button>
    </div>
  )
}

