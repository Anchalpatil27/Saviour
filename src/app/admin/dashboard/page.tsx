import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as { role?: string }).role !== 'admin') {
    redirect('/auth/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, Admin {session.user?.name}!</p>
      {/* Add more admin dashboard content here */}
    </div>
  )
}

