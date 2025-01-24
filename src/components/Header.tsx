'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  }

  return (
    <header className="bg-white text-black font-sans">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/Saviour.png" alt="SAVIOUR Logo" width={180} height={40} />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="hover:text-blue-600 transition-colors hover:scale-105 transform">About</Link>
            <Link href="/services" className="hover:text-blue-600 transition-colors hover:scale-105 transform">Services</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors hover:scale-105 transform">Contact</Link>
            <Link href="/donate" className="hover:text-blue-600 transition-colors hover:scale-105 transform">Donate</Link>
            {!session && (
              <>
                <Button asChild variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
            {session && (
              <>
                <Button asChild variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button onClick={handleSignOut} variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                  Sign Out
                </Button>
              </>
            )}
          </nav>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            <Link href="/donate" className="hover:text-blue-600 transition-colors">Donate</Link>
            {!session && (
              <>
                <Button asChild variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
            {session && (
              <>
                <Button asChild variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button onClick={handleSignOut} variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                  Sign Out
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

