"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  increment,
  setDoc,
  getDoc,
} from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Plus, Save, X, Info, Check, Ban, Package, ClipboardList, AlertTriangle, CheckCheck, Camera } from "lucide-react"
import { useUser } from "@/hooks/useUser"

const RESOURCE_CATEGORIES = [
  { id: "medical", name: "Medical Supplies", icon: Package, color: "bg-red-500" },
  { id: "food", name: "Food & Water", icon: Package, color: "bg-green-500" },
  { id: "shelter", name: "Shelter & Clothing", icon: Package, color: "bg-blue-500" },
  { id: "rescue", name: "Rescue Equipment", icon: Package, color: "bg-yellow-500" },
  { id: "communication", name: "Communication", icon: Package, color: "bg-purple-500" },
  { id: "transportation", name: "Transportation", icon: Package, color: "bg-cyan-500" },
  { id: "tools", name: "Tools & Equipment", icon: Package, color: "bg-lime-500" },
  { id: "energy", name: "Power & Fuel", icon: Package, color: "bg-orange-500" },
]

const DISASTER_RESOURCES = {
  medical: [
    "First Aid Kits", "Bandages", "Antiseptics", "Pain Relievers", "Antibiotics", "Blood Bags", "Oxygen Tanks", "Stretchers", "Defibrillators", "Surgical Kits",
  ],
  food: [
    "Drinking Water", "Canned Food", "Dry Rations", "Baby Formula", "Energy Bars", "Water Purification Tablets", "Cooking Gas", "Emergency Food Packets",
  ],
  shelter: [
    "Tents", "Blankets", "Sleeping Bags", "Tarpaulins", "Emergency Clothing", "Mattresses", "Pillows", "Raincoats", "Winter Jackets",
  ],
  rescue: [
    "Life Jackets", "Ropes", "Helmets", "Flashlights", "Megaphones", "Rescue Boats", "Ladders", "Cutting Tools", "Safety Harnesses",
  ],
  communication: [
    "Walkie Talkies", "Satellite Phones", "Emergency Radios", "Signal Flares", "Whistles", "Mobile Chargers", "Power Banks", "Antennas",
  ],
  transportation: [
    "Ambulances", "Rescue Vehicles", "Boats", "Helicopters", "Motorcycles", "Bicycles", "Fuel", "Vehicle Parts",
  ],
  tools: [
    "Generators", "Chainsaws", "Shovels", "Pickaxes", "Crowbars", "Tool Kits", "Heavy Machinery", "Pumps", "Hoses",
  ],
  energy: [
    "Portable Generators", "Solar Panels", "Batteries", "Fuel Cans", "Power Cables", "Inverters", "Emergency Lights", "Charging Stations",
  ],
}

type Resource = {
  id: string
  name: string
  description: string
  available: number
  total: number
  city: string
  category: string
  priority: "low" | "medium" | "high" | "critical"
  imageUrl?: string
  createdAt: any
  lastUpdated?: any
  minThreshold: number
  createdBy: string
}

type ResourceRequest = {
  id: string
  resourceId: string
  resourceName: string
  quantity: number
  userId: string
  userName: string
  userPhone?: string
  userEmail?: string
  status: "pending" | "approved" | "rejected" | "fulfilled"
  priority: "low" | "medium" | "high" | "critical"
  createdAt: any
  processedAt?: any
  processedBy?: string
  city: string
  category: string
  urgencyNote?: string
  deliveryAddress?: string
  contactNumber: string
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "critical": return "text-red-600"
    case "high": return "text-yellow-600"
    case "medium": return "text-blue-600"
    case "low": return "text-green-600"
    default: return "text-gray-400"
  }
}
function getStatusColor(status: string) {
  switch (status) {
    case "approved": return "bg-green-100 text-green-700"
    case "rejected": return "bg-red-100 text-red-700"
    case "fulfilled": return "bg-purple-100 text-purple-700"
    case "pending": return "bg-yellow-100 text-yellow-700"
    default: return "bg-gray-100 text-gray-700"
  }
}

export default function AdminResourcesPage() {
  const { user: currentUser } = useUser() as { user: { uid?: string; name?: string; email?: string; image?: string } | null }
  const [adminCity, setAdminCity] = useState<string>("")
  const [resources, setResources] = useState<Resource[]>([])
  const [requests, setRequests] = useState<ResourceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null)
  const [mode, setMode] = useState<"add" | "edit">("add")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [total, setTotal] = useState("")
  const [available, setAvailable] = useState("")
  const [category, setCategory] = useState("medical")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [minThreshold, setMinThreshold] = useState("")
  const [selectedQuickAdd, setSelectedQuickAdd] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"resources" | "requests">("resources")
  const [resourceFilter, setResourceFilter] = useState("all")
  const [requestFilter, setRequestFilter] = useState("pending")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [processing, setProcessing] = useState(false)
  const [snackbar, setSnackbar] = useState<{ show: boolean; message: string; type?: string }>({ show: false, message: "" })

  // Optimized: Fetch admin city once, cache in localStorage, use for resource creation
  useEffect(() => {
    if (!currentUser || !currentUser.uid) return
    const localKey = `adminCity_${currentUser.uid}`
    const cachedCity = typeof window !== 'undefined' ? localStorage.getItem(localKey) : null
    if (cachedCity) {
      setAdminCity(cachedCity)
      return
    }
    
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        let city = window.prompt('Enter your city (for admin resource management):')
        if (!city || !city.trim()) city = 'DefaultCity'
        setAdminCity(city)
        localStorage.setItem(localKey, city)
      }, 100)
    } else {
      setAdminCity('DefaultCity')
    }
  }, [currentUser])

  // Fetch resources and requests
  useEffect(() => {
    if (!adminCity) return
    setLoading(true)
    const resourcesQuery = query(collection(db, "resources"), where("city", "==", adminCity), orderBy("name", "asc"))
    const unsubResources = onSnapshot(resourcesQuery, (snap) => {
      const data: Resource[] = []
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Resource))
      setResources(data)
      setLoading(false)
    })
    const requestsQuery = query(collection(db, "requests"), where("city", "==", adminCity), orderBy("createdAt", "desc"))
    const unsubRequests = onSnapshot(requestsQuery, (snap) => {
      const data: ResourceRequest[] = []
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as ResourceRequest))
      setRequests(data)
    })
    return () => {
      unsubResources()
      unsubRequests()
    }
  }, [adminCity])

  // Snackbar
  useEffect(() => {
    if (snackbar.show) {
      const t = setTimeout(() => setSnackbar({ show: false, message: "" }), 2500)
      return () => clearTimeout(t)
    }
  }, [snackbar])

  // Filtering
  const filteredResources = resources.filter((resource) => {
    if (categoryFilter !== "all" && resource.category !== categoryFilter) return false
    if (resourceFilter === "available") return resource.available > 0
    if (resourceFilter === "low") return resource.available <= resource.minThreshold
    if (resourceFilter === "critical") return resource.priority === "critical"
    return true
  })
  const filteredRequests = requests.filter((request) => {
    if (requestFilter === "all") return true
    return request.status === requestFilter
  })

  // Modal open helpers
  const openAddModal = () => {
    setMode("add")
    setName("")
    setDescription("")
    setTotal("")
    setAvailable("")
    setCategory("medical")
    setPriority("medium")
    setMinThreshold("")
    setSelectedQuickAdd(null)
    setModalOpen(true)
  }
  const openEditModal = (resource: Resource) => {
    setMode("edit")
    setSelectedResource(resource)
    setName(resource.name)
    setDescription(resource.description)
    setTotal(resource.total.toString())
    setAvailable(resource.available.toString())
    setCategory(resource.category)
    setPriority(resource.priority)
    setMinThreshold(resource.minThreshold?.toString() || "")
    setSelectedQuickAdd(null)
    setModalOpen(true)
  }
  const openRequestModal = (request: ResourceRequest) => {
    setSelectedRequest(request)
    setRequestModalOpen(true)
  }

  // Core logic: Add/Edit Resource
  const handleSubmit = async () => {
    if (!name.trim()) return setSnackbar({ show: true, message: "Resource name is required" })
    if (!total.trim() || isNaN(Number(total)) || Number(total) <= 0) return setSnackbar({ show: true, message: "Please enter a valid total quantity" })
    if (!available.trim() || isNaN(Number(available)) || Number(available) < 0) return setSnackbar({ show: true, message: "Please enter a valid available quantity" })
    if (Number(available) > Number(total)) return setSnackbar({ show: true, message: "Available cannot be greater than total" })
    if (!adminCity || adminCity === "DefaultCity") return setSnackbar({ show: true, message: "Admin city not set. Cannot add resource." })
    if (!currentUser?.uid) return setSnackbar({ show: true, message: "User not authenticated. Cannot add resource." })
    setProcessing(true)
    try {
      const resourceData = {
        name: name.trim(),
        description: description.trim(),
        total: Number(total),
        available: Number(available),
        city: adminCity,
        category,
        priority,
        minThreshold: Number(minThreshold) || 5,
        lastUpdated: new Date(),
        createdBy: currentUser.uid,
        ...(mode === "add" && { createdAt: new Date() }),
      }
      if (mode === "add") {
        await addDoc(collection(db, "resources"), resourceData)
        setSnackbar({ show: true, message: "Resource added successfully" })
      } else if (selectedResource) {
        await updateDoc(doc(db, "resources", selectedResource.id), resourceData)
        setSnackbar({ show: true, message: "Resource updated successfully" })
      }
      setModalOpen(false)
    } catch {
      setSnackbar({ show: true, message: "Failed to save resource" })
    } finally {
      setProcessing(false)
    }
  }

  // Delete Resource
  const handleDelete = async () => {
    if (!selectedResource) return
    if (!window.confirm(`Are you sure you want to delete ${selectedResource.name}?`)) return
    setProcessing(true)
    try {
      await deleteDoc(doc(db, "resources", selectedResource.id))
      setSnackbar({ show: true, message: "Resource deleted successfully" })
      setModalOpen(false)
    } catch {
      setSnackbar({ show: true, message: "Failed to delete resource" })
    } finally {
      setProcessing(false)
    }
  }

  // Add Stock
  const handleAddStock = async (resourceId: string, additionalQuantity: number) => {
    try {
      await updateDoc(doc(db, "resources", resourceId), {
        available: increment(additionalQuantity),
        total: increment(additionalQuantity),
        lastUpdated: new Date(),
      })
      setSnackbar({ show: true, message: `Added ${additionalQuantity} units successfully` })
    } catch {
      setSnackbar({ show: true, message: "Failed to add stock" })
    }
  }

  // Request Actions
  const handleRequestAction = async (action: "approve" | "reject" | "fulfill") => {
    if (!selectedRequest) return
    setProcessing(true)
    try {
      const updateData: any = {
        status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "fulfilled",
        processedAt: new Date(),
        processedBy: currentUser?.uid ?? "",
      }
      await updateDoc(doc(db, "requests", selectedRequest.id), updateData)
      // If approved or fulfilled, update resource availability
      if (action === "approve" || action === "fulfill") {
        const resource = resources.find(
          (r) => r.id === selectedRequest.resourceId || r.name === selectedRequest.resourceName,
        )
        if (resource) {
          const newAvailable = resource.available - selectedRequest.quantity
          if (newAvailable < 0) {
            setSnackbar({ show: true, message: "Not enough resources available" })
            return
          }
          await updateDoc(doc(db, "resources", resource.id), {
            available: newAvailable,
            lastUpdated: new Date(),
          })
          // Create notification for user
          await addDoc(collection(db, "notifications"), {
            userId: selectedRequest.userId,
            title: `Request ${action === "approve" ? "Approved" : "Fulfilled"}`,
            message: `Your request for ${selectedRequest.quantity} ${selectedRequest.resourceName} has been ${action === "approve" ? "approved" : "fulfilled"}.`,
            type: action === "approve" ? "approval" : "fulfillment",
            resourceId: resource.id,
            requestId: selectedRequest.id,
            createdAt: new Date(),
            read: false,
            city: adminCity,
          })
        }
      }
      setSnackbar({ show: true, message: `Request ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "fulfilled"}` })
      setRequestModalOpen(false)
    } catch {
      setSnackbar({ show: true, message: "Failed to process request" })
    } finally {
      setProcessing(false)
    }
  }

  const isAdminReady = !!adminCity && adminCity !== "DefaultCity" && !!currentUser?.uid;
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow p-6 mb-2">
          <div>
            <div className="text-gray-500 text-sm font-medium">
              {adminCity ? `${adminCity} • ${resources.length} Resources • ${requests.filter((r) => r.status === "pending").length} Pending` : "Loading admin info..."}
            </div>
          </div>
          <Button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white rounded-full px-4 py-2 shadow"
            disabled={!isAdminReady}
            title={!isAdminReady ? "Admin city or user not loaded yet" : undefined}
          >
            <Plus className="w-5 h-5" /> Add Resource
          </Button>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl shadow p-2">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition ${activeTab === "resources" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}
            onClick={() => setActiveTab("resources")}
          >
            <Package className="w-5 h-5" /> Resources ({filteredResources.length})
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition ${activeTab === "requests" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}
            onClick={() => setActiveTab("requests")}
          >
            <ClipboardList className="w-5 h-5" /> Requests ({filteredRequests.length})
          </button>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 py-2">
          {activeTab === "resources" ? (
            <>
              {["all", "available", "low", "critical"].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-1 rounded-full border text-sm font-semibold ${resourceFilter === filter ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}
                  onClick={() => setResourceFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
              {RESOURCE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`flex items-center gap-1 px-4 py-1 rounded-full border text-sm font-semibold ${categoryFilter === cat.id ? `${cat.color} text-white border-transparent` : "bg-gray-100 text-gray-700 border-gray-200"}`}
                  onClick={() => setCategoryFilter(categoryFilter === cat.id ? "all" : cat.id)}
                >
                  <span className="w-2 h-2 rounded-full mr-1" style={{ background: cat.color.replace("bg-", "") }}></span>
                  {cat.name}
                </button>
              ))}
            </>
          ) : (
            ["all", "pending", "approved", "rejected"].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-1 rounded-full border text-sm font-semibold ${requestFilter === filter ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}
                onClick={() => setRequestFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))
          )}
        </div>
        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <div className="mt-4 text-gray-400">Loading resources...</div>
          </div>
        ) : activeTab === "resources" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((item) => {
              const isLowStock = item.available <= item.minThreshold
              const stockPercentage = (item.available / item.total) * 100
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-xl transition cursor-pointer"
                  onClick={() => openEditModal(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full ${RESOURCE_CATEGORIES.find((cat) => cat.id === item.category)?.color || "bg-gray-200"}`}>
                        <Package className="w-4 h-4 text-white" />
                      </span>
                      <span className="text-xs font-semibold">{RESOURCE_CATEGORIES.find((cat) => cat.id === item.category)?.name || item.category}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(item.priority)}`}>{item.priority.toUpperCase()}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-bold">{item.name}</div>
                    {item.description && <div className="text-gray-500 text-sm">{item.description}</div>}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-sm">Available: <span className={isLowStock ? "text-red-600 font-bold" : "text-green-600 font-bold"}>{item.available}</span></div>
                    <div className="text-sm text-gray-400">Total: {item.total}</div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded mt-2">
                    <div className={`h-2 rounded ${isLowStock ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${stockPercentage}%` }} />
                  </div>
                  {isLowStock && (
                    <div className="flex items-center gap-1 text-yellow-600 text-xs font-semibold mt-1">
                      <AlertTriangle className="w-4 h-4" /> Low Stock
                    </div>
                  )}
                  <button
                    className="mt-2 flex items-center gap-1 px-3 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100"
                    onClick={e => { e.stopPropagation(); const qty = prompt("Enter quantity to add:"); if (qty && Number(qty) > 0) handleAddStock(item.id, Number(qty)) }}
                  >
                    <Plus className="w-4 h-4" /> Add Stock
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-xl transition cursor-pointer"
                onClick={() => openRequestModal(item)}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(item.status)}`}>{item.status.toUpperCase()}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(item.priority)}`}>{item.priority.toUpperCase()}</span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-bold">{item.resourceName}</div>
                  <div className="text-gray-500 text-sm">Quantity: {item.quantity} units</div>
                  <div className="text-gray-400 text-xs">Requested by: {item.userName || "Unknown User"}</div>
                  <div className="text-gray-400 text-xs">Contact: {item.contactNumber}</div>
                {item.urgencyNote && <div className="text-yellow-600 text-xs italic">Note: {item.urgencyNote}</div>}
                  <div className="text-gray-300 text-xs">{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "N/A"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Resource Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DialogTitle>{mode === "add" ? "Add Resource" : "Edit Resource"}</DialogTitle>
            <div className="space-y-6 py-2">
              {/* Image Upload (web only, preview only, no backend logic change) */}
              <div className="flex flex-col items-center gap-2">
                <label className="block text-base font-semibold mb-1">Resource Image (optional)</label>
                <input type="file" accept="image/*" className="mb-2" style={{ maxWidth: 300 }} disabled />
                {/* Image upload is UI only for now, backend logic unchanged */}
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <Camera className="w-10 h-10" />
                </div>
                <span className="text-xs text-gray-400">(Image upload coming soon)</span>
              </div>
              <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
                <div className="space-y-2">
                  <label className="block text-base font-semibold mb-1">Resource Name *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter resource name" size={32} className="h-12 text-base px-4" />
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-semibold mb-1">Description</label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter description" size={32} className="h-12 text-base px-4" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-base font-semibold mb-1">Total *</label>
                    <Input value={total} onChange={e => setTotal(e.target.value)} type="number" min={0} size={16} className="h-12 text-base px-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-base font-semibold mb-1">Available *</label>
                    <Input value={available} onChange={e => setAvailable(e.target.value)} type="number" min={0} size={16} className="h-12 text-base px-4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-semibold mb-1">Minimum Threshold</label>
                  <Input value={minThreshold} onChange={e => setMinThreshold(e.target.value)} type="number" min={0} size={16} className="h-12 text-base px-4" />
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-semibold mb-1">Category *</label>
                  <div className="flex flex-wrap gap-3">
                    {RESOURCE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full border text-base font-semibold ${category === cat.id ? `${cat.color} text-white border-transparent` : "bg-gray-100 text-gray-700 border-gray-200"}`}
                        onClick={() => setCategory(cat.id)}
                        type="button"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-semibold mb-1">Priority *</label>
                  <div className="flex gap-3">
                    {"low,medium,high,critical".split(",").map((p) => (
                      <button
                        key={p}
                        className={`px-4 py-2 rounded-full border text-base font-semibold ${priority === p ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}
                        onClick={() => setPriority(p as any)}
                        type="button"
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Quick Add */}
                {category && DISASTER_RESOURCES[category as keyof typeof DISASTER_RESOURCES] && (
                  <div className="space-y-2">
                    <label className="block text-base font-semibold mb-1">Quick Add</label>
                    <div className="flex flex-wrap gap-3">
                      {DISASTER_RESOURCES[category as keyof typeof DISASTER_RESOURCES].map((resourceName) => (
                        <button
                          key={resourceName}
                          className={`px-4 py-2 rounded-full border text-base font-semibold ${selectedQuickAdd === resourceName ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}
                          onClick={() => { setName(resourceName); setSelectedQuickAdd(resourceName) }}
                          type="button"
                        >
                          {resourceName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="flex gap-2 mt-4">
              {mode === "edit" && (
                <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                  <Ban className="w-4 h-4 mr-1" /> Delete
                </Button>
              )}
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={processing}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={processing || !isAdminReady} title={!isAdminReady ? "Admin city or user not loaded yet" : undefined}>
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                {mode === "add" ? "Add Resource" : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Request Modal */}
        <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
          <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <DialogTitle>Request Details</DialogTitle>
            {selectedRequest && (
              <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">{selectedRequest.resourceName}</div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedRequest.status)}`}>{selectedRequest.status.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">Quantity</div>
                    <div className="font-semibold">{selectedRequest.quantity} units</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Requester</div>
                    <div className="font-semibold">{selectedRequest.userName || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Contact</div>
                    <div className="font-semibold">{selectedRequest.contactNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Priority</div>
                    <div className={`font-semibold ${getPriorityColor(selectedRequest.priority)}`}>{selectedRequest.priority.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Requested</div>
                    <div className="font-semibold">{selectedRequest.createdAt?.toDate ? selectedRequest.createdAt.toDate().toLocaleString() : "N/A"}</div>
                  </div>
                  {selectedRequest.deliveryAddress && (
                    <div>
                      <div className="text-xs text-gray-500">Delivery Address</div>
                      <div className="font-semibold">{selectedRequest.deliveryAddress}</div>
                    </div>
                  )}
                </div>
                {selectedRequest.urgencyNote && (
                  <div className="flex items-center gap-2 bg-yellow-50 rounded p-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-700 text-sm">{selectedRequest.urgencyNote}</span>
                  </div>
                )}
                {(selectedRequest.status === "pending" || selectedRequest.status === "approved") && (
                  <div className="flex gap-2 mt-4">
                    {selectedRequest.status === "pending" && (
                      <>
                        <Button variant="destructive" onClick={() => handleRequestAction("reject" )} disabled={processing}>
                          <Ban className="w-4 h-4 mr-1" /> Reject
                        </Button>
                        <Button variant="default" onClick={() => handleRequestAction("approve")} disabled={processing}>
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                      </>
                    )}
                    {selectedRequest.status === "approved" && (
                      <Button variant="default" onClick={() => handleRequestAction("fulfill")} disabled={processing}>
                        <CheckCheck className="w-4 h-4 mr-1" /> Mark as Fulfilled
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* Snackbar */}
        {snackbar.show && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 flex items-center gap-2 bg-white shadow-lg rounded-lg px-4 py-2 border border-blue-100">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{snackbar.message}</span>
          </div>
        )}
      </div>
    </div>
  )
}