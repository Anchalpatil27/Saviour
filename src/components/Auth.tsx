'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function Auth() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <div className="flex items-center space-x-4">
        <p>Signed in as {session.user.email}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    )
  }

  return (
    <Button onClick={() => signIn('google')}>Sign in with Google</Button>
  )
}
