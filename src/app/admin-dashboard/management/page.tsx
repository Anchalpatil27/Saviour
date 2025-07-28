"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Eye, Copy, User, Users, Ban, Loader2, Search } from "lucide-react"

type UserRole = "User" | "Employee" | "Admin"
type UserStatus = "Active" | "Suspended"

interface UserItem {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  createdAt?: any
  lastLogin?: any
  [key: string]: any
}

const ROLE_COLORS: Record<UserRole | UserStatus, string> = {
  User: "bg-blue-100 text-blue-700",
  Employee: "bg-green-100 text-green-700",
  Admin: "bg-purple-100 text-purple-700",
  Suspended: "bg-red-100 text-red-700",
  Active: "bg-green-100 text-green-700",
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Users", value: "users" },
  { label: "Employees", value: "employees" },
]

function capitalize(str?: string) {
  if (!str || typeof str !== "string") return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getRoleColor(role: UserRole, status: UserStatus): string {
  if (status === "Suspended") return ROLE_COLORS.Suspended
  return ROLE_COLORS[role] || "bg-gray-100 text-gray-700"
}

function RoleTag({ role, status }: { role: UserRole; status: UserStatus }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleColor(role, status)}`}>
      {status === "Suspended" ? "Suspended" : capitalize(role)}
    </span>
  )
}

function StatusDot({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full mr-2 ${status === "Active" ? "bg-green-500" : "bg-red-500"}`}
      title={status}
    />
  )
}

function ActionButton({
  icon,
  label,
  color,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode
  label: string
  color: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1 px-2 py-1 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      style={{ color }}
      onClick={onClick}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )
}

function ProfileDetailModal({
  open,
  user,
  onClose,
}: {
  open: boolean
  user: UserItem | null
  onClose: () => void
}) {
  if (!user) return null
  const infoFields = Object.entries(user)
    .filter(([k]) => !["id", "name", "email", "phone", "role", "status"].includes(k))
    .map(([k, v]) => (
      <div key={k} className="grid grid-cols-12 gap-2 py-2 border-b last:border-b-0 border-gray-100 items-center">
        <div className="col-span-4 md:col-span-3 font-semibold text-blue-700 text-sm capitalize truncate">{k.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}</div>
        <div className="col-span-8 md:col-span-9 text-gray-800 text-sm break-words">{typeof v === "string" ? v : JSON.stringify(v, null, 2)}</div>
      </div>
    ))
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-screen-md p-0 rounded-xl shadow-2xl border-0"
        style={{ maxHeight: "90vh" }}
      >
        {/* Accessibility: DialogTitle for screen readers */}
        <DialogTitle className="sr-only">User Profile Details</DialogTitle>
        <div className="flex flex-col h-full">
          {/* Sticky header for modal */}
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b p-6 rounded-t-xl">
            <div className="flex items-center gap-3">
              <User className="w-10 h-10 text-blue-600" />
              <div>
                <div className="text-xl md:text-2xl font-bold leading-tight">{capitalize(user.name)}</div>
                <div className="flex items-center gap-2 mt-1">
                  <RoleTag role={user.role} status={user.status} />
                  <span className="text-xs text-gray-500">{user.email}</span>
                  <span className="text-xs text-gray-500">{user.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Info section with scroll */}
          <div className="flex-1 px-0 md:px-6 py-4 bg-white" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <div className="mx-4 md:mx-0 rounded-lg bg-gray-50 border border-gray-100 p-4 shadow-inner">
              <div className="text-base font-semibold mb-2 text-gray-700">Additional Details</div>
              <div className="divide-y divide-gray-100">{infoFields.length > 0 ? infoFields : <div className='text-gray-400 text-sm'>No additional data.</div>}</div>
            </div>
          </div>
          <DialogFooter className="p-4 border-t flex justify-end bg-white rounded-b-xl">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ManagementPage() {
  const [filter, setFilter] = useState<"all" | "users" | "employees">("all")
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  // Fetch users or employees from Firestore
  const fetchUsers = async () => {
    setLoading(true)
    let data: UserItem[] = []
    try {
      if (filter === "users") {
        const snap = await getDocs(collection(db, "users"))
        snap.forEach((docSnap) => {
          const d = docSnap.data() as any
          data.push({
            id: "user_" + docSnap.id,
            name: capitalize(d.fullName || d.name),
            email: d.email,
            phone: d.phone,
            role: "User",
            status: capitalize(d.status) as UserStatus || "Active",
            createdAt: d.createdAt,
            lastLogin: d.lastLogin,
            ...d,
          })
        })
      } else if (filter === "employees") {
        const snap = await getDocs(collection(db, "employees"))
        snap.forEach((docSnap) => {
          const d = docSnap.data() as any
          data.push({
            id: "employee_" + docSnap.id,
            name: capitalize(d.fullName || d.name),
            email: d.email,
            phone: d.phone,
            role: "Employee",
            status: capitalize(d.status) as UserStatus || "Active",
            createdAt: d.createdAt,
            lastLogin: d.lastLogin,
            ...d,
          })
        })
      } else {
        const userSnap = await getDocs(collection(db, "users"))
        userSnap.forEach((docSnap) => {
          const d = docSnap.data() as any
          data.push({
            id: "user_" + docSnap.id,
            name: capitalize(d.fullName || d.name),
            email: d.email,
            phone: d.phone,
            role: "User",
            status: capitalize(d.status) as UserStatus || "Active",
            createdAt: d.createdAt,
            lastLogin: d.lastLogin,
            ...d,
          })
        })
        const empSnap = await getDocs(collection(db, "employees"))
        empSnap.forEach((docSnap) => {
          const d = docSnap.data() as any
          data.push({
            id: "employee_" + docSnap.id,
            name: capitalize(d.fullName || d.name),
            email: d.email,
            phone: d.phone,
            role: "Employee",
            status: capitalize(d.status) as UserStatus || "Active",
            createdAt: d.createdAt,
            lastLogin: d.lastLogin,
            ...d,
          })
        })
      }
      // Search filter
      let filtered = data
      if (search) {
        filtered = data.filter(
          (u) =>
            (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
            (u.phone && u.phone.includes(search))
        )
      }
      setUsers(filtered)
    } catch (e) {
      alert("Failed to fetch users.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [filter, search])

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    alert("Email copied to clipboard.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Filter/Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "outline"}
                onClick={() => setFilter(f.value as any)}
                className="flex items-center gap-2 rounded-full px-4 py-2 shadow-sm border border-gray-200"
              >
                {f.value === "all" ? <Users className="w-4 h-4" /> : f.value === "users" ? <User className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                <span className="font-medium">{f.label}</span>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full md:w-96 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search name, email, phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-0 focus:ring-0 bg-transparent text-base"
            />
          </div>
        </div>
        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100/95 backdrop-blur border-b">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Name</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Email</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Phone</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Role</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 text-base">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={
                        `transition hover:bg-blue-50/60 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`
                      }
                    >
                      <td className="px-5 py-3 flex items-center gap-2 whitespace-nowrap">
                        <StatusDot status={item.status} />
                        <span className="font-medium text-gray-900">{capitalize(item.name)}</span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">{item.email}</td>
                      <td className="px-5 py-3 whitespace-nowrap">{item.phone}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <RoleTag role={item.role} status={item.status} />
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <Badge className={item.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 flex flex-wrap gap-1 whitespace-nowrap">
                        <ActionButton
                          icon={<Eye className="w-4 h-4" />}
                          label="View"
                          color="#2563eb"
                          onClick={() => {
                            setSelectedUser(item)
                            setProfileOpen(true)
                          }}
                        />
                        <ActionButton
                          icon={<Mail className="w-4 h-4" />}
                          label="Email"
                          color="#2563eb"
                          onClick={() => window.open(`mailto:${item.email}`)}
                        />
                        <ActionButton
                          icon={<Phone className="w-4 h-4" />}
                          label="Call"
                          color="#22c55e"
                          onClick={() => window.open(`tel:${item.phone}`)}
                        />
                        <ActionButton
                          icon={<Copy className="w-4 h-4" />}
                          label="Copy"
                          color="#a21caf"
                          onClick={() => handleCopyEmail(item.email)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <ProfileDetailModal open={profileOpen} user={selectedUser} onClose={() => setProfileOpen(false)} />
      </div>
    </div>
  )
}