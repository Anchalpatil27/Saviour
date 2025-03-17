"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"

interface UserDetailProps {
  id: string
}

interface User {
  id: string
  name: string
  email: string
  city: string
  role: string
  createdAt: string
  updatedAt?: string
}

export default function UserDetail({ id }: UserDetailProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/users/${id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status}`)
        }

        const data = await response.json()
        setUser(data)
      } catch (err) {
        console.error("Error fetching user:", err)
        setError(err instanceof Error ? err.message : "Failed to load user")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id])

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/admin/users">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/users">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>

        {!isLoading && user && (
          <Link href={`/admin/users/edit/${id}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-lg">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">City</p>
                  <p className="text-lg">{user.city}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-lg capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-lg">{new Date(user.createdAt).toLocaleString()}</p>
                </div>
                {user.updatedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-lg">{new Date(user.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center">User not found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

