'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar onLinkClick={handleLinkClick} isMobile={true} />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold flex-grow text-center">SAVIOUR Dashboard</h1>
      </div>
    </div>
  )
}

