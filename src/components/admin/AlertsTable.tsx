"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, Eye, Bell, BellOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"

interface Alert {
  id: string
  title: string
  type: string
  severity: string
  message: string
  city: string
  active: boolean
  createdAt: Date
  expiresAt: Date | null
}

interface AlertsTableProps {
  alerts: Alert[]
  preserveCity?: string
}

export function AlertsTable({ alerts: initialAlerts, preserveCity }: AlertsTableProps) {
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [deleteAlertId, setDeleteAlertId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleEdit = (alertId: string) => {
    // Preserve city filter when navigating
    const cityParam = preserveCity ? `?city=${preserveCity}` : ""
    router.push(`/admin/alerts/edit/${alertId}${cityParam}`)
  }

  const handleView = (alertId: string) => {
    // Preserve city filter when navigating
    const cityParam = preserveCity ? `?city=${preserveCity}` : ""
    router.push(`/admin/alerts/${alertId}${cityParam}`)
  }

  const handleToggleActive = async (alertId: string, currentActive: boolean) => {
    setIsLoading(alertId)
    try {
      const response = await fetch(`/api/admin/alerts/${alertId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !currentActive }),
      })

      if (response.ok) {
        // Update local state
        setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, active: !currentActive } : alert)))
      } else {
        console.error("Failed to toggle alert status")
      }
    } catch (error) {
      console.error("Error toggling alert status:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteAlertId) return

    try {
      const response = await fetch(`/api/admin/alerts/${deleteAlertId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Update local state
        setAlerts(alerts.filter((alert) => alert.id !== deleteAlertId))
      } else {
        console.error("Failed to delete alert")
      }
    } catch (error) {
      console.error("Error deleting alert:", error)
    } finally {
      setDeleteAlertId(null)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 hover:bg-red-600"
      case "high":
        return "bg-orange-500 hover:bg-orange-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.title}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  </TableCell>
                  <TableCell>{alert.city}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={alert.active}
                        disabled={isLoading === alert.id}
                        onCheckedChange={() => handleToggleActive(alert.id, alert.active)}
                      />
                      <span>{alert.active ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(alert.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{alert.expiresAt ? new Date(alert.expiresAt).toLocaleDateString() : "Never"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(alert.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(alert.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(alert.id, alert.active)}>
                          {alert.active ? (
                            <>
                              <BellOff className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Bell className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteAlertId(alert.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No alerts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteAlertId} onOpenChange={() => setDeleteAlertId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the alert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

