'use client'

import { ReactNode } from 'react'
import { DynamicMobileHeader } from './DaynamicDashboardComponents'
import { AdminSidebar } from '@/components/AdminSidebar'
import { useResponsive } from '@/hooks/useResponsive'

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { isMobile } = useResponsive()

  return (
    <div className="flex h-screen bg-gray-100">
      {!isMobile && <AdminSidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isMobile && (
          <div className="bg-white border-b p-3 flex justify-between items-center">
            <h2 className="font-bold text-lg text-indigo-700">Admin Panel</h2>
            <DynamicMobileHeader />
          </div>
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          <div className="container mx-auto px-6 py-8 relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
