'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function AdminSignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Admin Sign In</h3>
        <div className="mt-4">
          <Button onClick={() => signIn('google')} className="w-full px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-900">Sign In with Google</Button>
        </div>
      </div>
    </div>
  )
}

