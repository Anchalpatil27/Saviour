"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  city: string
  role: string
  createdAt: Date
}

interface UserTableProps {
  users: User[]
  preserveCity?: string
}

export default function UserTable({ users: initialUsers, preserveCity }: UserTableProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleEdit = (userId: string) => {
    // Preserve city filter when navigating
    const cityParam = preserveCity ? `?city=${preserveCity}` : ""
    router.push(`/admin/users/edit/${userId}${cityParam}`)
  }

  const handleView = (userId: string) => {
    // Preserve city filter when navigating
    const cityParam = preserveCity ? `?city=${preserveCity}` : ""
    router.push(`/admin/users/${userId}${cityParam}`)
  }

  const handleDelete = async () => {
    if (!deleteUserId) return

    try {
      const response = await fetch(`/api/admin/users/${deleteUserId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Update local state
        setUsers(users.filter((user) => user.id !== deleteUserId))
      } else {
        console.error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setDeleteUserId(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.city}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(user.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteUserId(user.id)} className="text-red-600">
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteUserId(null)}>
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

