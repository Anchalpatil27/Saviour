import './globals.css'
import { Inter, Merriweather } from 'next/font/google'
import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Analytics } from "@vercel/analytics/react"
import { getServerSession } from "next-auth/next"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const merriweather = Merriweather({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-merriweather' })

export const metadata = {
  title: 'SAVIOUR - Disaster Management Platform',
  description: 'A comprehensive platform for disaster preparedness and response',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans flex flex-col min-h-screen`}>
        <Providers session={session}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Analytics />
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

