"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
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

export default function ResourcesTable({ resources: initialResources, preserveCity }: ResourcesTableProps) {
  const router = useRouter()
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
        console.error("Failed to toggle resource status")
      }
    } catch (error) {
      console.error("Error toggling resource status:", error)
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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
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
                  <TableCell>{resource.type}</TableCell>
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
                              <Trash2 className="mr-2 h-4 w-4" />
                              Mark Unavailable
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
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
                <TableCell colSpan={6} className="h-24 text-center">
                  No resources found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {deleteResourceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this resource? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteResourceId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

