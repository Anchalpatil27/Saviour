"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
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

interface Resource {
  id: string
  name: string
  type: string
  description: string
  location: string
  city: string
  contact: string
  available: boolean
  createdAt: Date
}

interface ResourcesTableProps {
  resources: Resource[]
  preserveCity?: string
}

export function ResourcesTable({ resources: initialResources, preserveCity }: ResourcesTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleEdit = (resourceId: string) => {
    // Preserve city filter when navigating
    const cityParam = preserveCity ? `?city=${preserveCity}` : ""
    router.push(`/admin/resources/edit/${resourceId}${cityParam}`)
  }

  const handleView = (resourceId: string) => {
    // Preserve city filter when navigating
    const cityParam = preserveCity ? `?city=${preserveCity}` : ""
    router.push(`/admin/resources/${resourceId}${cityParam}`)
  }

  const handleToggleAvailable = async (resourceId: string, currentAvailable: boolean) => {
    setIsLoading(resourceId)
    try {
      const response = await fetch(`/api/admin/resources/${resourceId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available: !currentAvailable }),
      })

      if (response.ok) {
        // Update local state
        setResources(
          resources.map((resource) =>
            resource.id === resourceId ? { ...resource, available: !currentAvailable } : resource,
          ),
        )
      } else {
        console.error("Failed to toggle resource availability")
      }
    } catch (error) {
      console.error("Error toggling resource availability:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteResourceId) return

    try {
      const response = await fetch(`/api/admin/resources/${deleteResourceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Update local state
        setResources(resources.filter((resource) => resource.id !== deleteResourceId))
      } else {
        console.error("Failed to delete resource")
      }
    } catch (error) {
      console.error("Error deleting resource:", error)
    } finally {
      setDeleteResourceId(null)
    }
  }

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case "shelter":
        return "bg-blue-500 hover:bg-blue-600"
      case "food":
        return "bg-green-500 hover:bg-green-600"
      case "medical":
        return "bg-red-500 hover:bg-red-600"
      case "evacuation":
        return "bg-orange-500 hover:bg-orange-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length > 0 ? (
              resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>
                    <Badge className={getResourceTypeColor(resource.type)}>{resource.type}</Badge>
                  </TableCell>
                  <TableCell>{resource.location}</TableCell>
                  <TableCell>{resource.city}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={resource.available}
                        disabled={isLoading === resource.id}
                        onCheckedChange={() => handleToggleAvailable(resource.id, resource.available)}
                      />
                      <span>{resource.available ? "Available" : "Unavailable"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(resource.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(resource.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(resource.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleAvailable(resource.id, resource.available)}>
                          {resource.available ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark Unavailable
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Available
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteResourceId(resource.id)} className="text-red-600">
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
                <TableCell colSpan={7} className="h-24 text-center">
                  {preserveCity ? `No resources found in ${preserveCity}.` : "No resources found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteResourceId} onOpenChange={() => setDeleteResourceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource.
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

