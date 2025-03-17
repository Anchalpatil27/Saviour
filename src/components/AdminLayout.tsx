"use client"

import type React from "react"

import { AdminSidebar } from "@/components/AdminSidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      {!isMobile && <AdminSidebar />}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[80%] max-w-[300px]">
            <AdminSidebar isMobile onLinkClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 flex h-auto items-center border-b bg-background px-4 md:px-6">
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => setIsOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
        <main className="container py-6">{children}</main>
      </div>
    </div>
  )
}

