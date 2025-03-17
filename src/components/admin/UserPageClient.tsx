"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import UserDetail from "@/components/admin/UserDetail"
import UserForm from "@/components/admin/UserForm"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserPageClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const mode = searchParams.get("mode")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Just to simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!id) {
    return <div>No user ID provided</div>
  }

  const isEdit = mode === "edit"

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{isEdit ? "Edit User" : "User Details"}</h1>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      ) : isEdit ? (
        <UserForm id={id} />
      ) : (
        <UserDetail id={id} />
      )}
    </div>
  )
}

