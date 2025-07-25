"use client"

// filepath: c:\Users\ayush\Desktop\Saviour2.O\src\app\dashboard\resources\page.tsx

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Home, Hammer, Truck, Radio, Utensils, HeartPulse, Package, Loader2, X, Send } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore"

const RESOURCE_CATEGORIES = [
  { id: "medical", name: "Medical Supplies", icon: <HeartPulse className="w-4 h-4 text-red-500" /> },
  { id: "food", name: "Food & Water", icon: <Utensils className="w-4 h-4 text-green-500" /> },
  { id: "shelter", name: "Shelter & Clothing", icon: <Home className="w-4 h-4 text-blue-500" /> },
  { id: "rescue", name: "Rescue Equipment", icon: <CheckCircle2 className="w-4 h-4 text-yellow-500" /> },
  { id: "communication", name: "Communication", icon: <Radio className="w-4 h-4 text-indigo-500" /> },
  { id: "transportation", name: "Transportation", icon: <Truck className="w-4 h-4 text-cyan-500" /> },
  { id: "tools", name: "Tools & Equipment", icon: <Hammer className="w-4 h-4 text-lime-500" /> },
  { id: "energy", name: "Power & Fuel", icon: <Package className="w-4 h-4 text-orange-500" /> },
]

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

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-500 text-white",
  high: "bg-yellow-500 text-white",
  medium: "bg-blue-500 text-white",
  low: "bg-green-500 text-white",
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  fulfilled: "bg-purple-100 text-purple-700",
}

export default function ResourcesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userCity, setUserCity] = useState<string>("")
  const [resources, setResources] = useState<Resource[]>([])
  const [myRequests, setMyRequests] = useState<ResourceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"resources" | "requests">("resources")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("available")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [quantity, setQuantity] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [urgencyNote, setUrgencyNote] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auth check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        router.push("/auth/login")
      } else {
        setUser(firebaseUser)
      }
    })
    return () => unsubscribe()
  }, [router])

  // Get user's city from Firestore
  useEffect(() => {
    if (!user) return
    const fetchUserCity = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserCity(userDoc.data().city || "DefaultCity")
        } else {
          setUserCity("DefaultCity")
        }
      } catch {
        setUserCity("DefaultCity")
      }
    }
    fetchUserCity()
  }, [user])

  // Fetch resources and requests
  useEffect(() => {
    if (!userCity || !user) return
    setLoading(true)
    // Resources
    const resourcesQuery = query(
      collection(db, "resources"),
      where("city", "==", userCity),
      orderBy("name", "asc")
    )
    const unsubResources = onSnapshot(resourcesQuery, (snapshot) => {
      const data: Resource[] = []
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Resource)
      })
      setResources(data)
      setLoading(false)
    })
    // Requests
    const requestsQuery = query(
      collection(db, "requests"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )
    const unsubRequests = onSnapshot(requestsQuery, (snapshot) => {
      const data: ResourceRequest[] = []
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as ResourceRequest)
      })
      setMyRequests(data)
    })
    return () => {
      unsubResources()
      unsubRequests()
    }
  }, [userCity, user])

  // Filtering
  const filteredResources = resources.filter((resource) => {
    if (categoryFilter !== "all" && resource.category !== categoryFilter) return false
    if (availabilityFilter === "available") return resource.available > 0
    if (availabilityFilter === "unavailable") return resource.available === 0
    return true
  })

  // Open request modal
  const openRequestModal = (resource: Resource) => {
    setSelectedResource(resource)
    setQuantity("")
    setPriority("medium")
    setUrgencyNote("")
    setDeliveryAddress("")
    setContactNumber("")
    setModalOpen(true)
    setError(null)
  }

  // Submit request
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedResource || !user) return
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError("Please enter a valid quantity")
      return
    }
    if (Number(quantity) > selectedResource.available) {
      setError("Requested quantity exceeds available stock")
      return
    }
    if (!contactNumber.trim()) {
      setError("Contact number is required")
      return
    }
    setProcessing(true)
    try {
      await addDoc(collection(db, "requests"), {
        resourceId: selectedResource.id,
        resourceName: selectedResource.name,
        quantity: Number(quantity),
        userId: user.uid,
        userName: user.displayName || "Unknown User",
        userEmail: user.email,
        status: "pending",
        priority,
        createdAt: serverTimestamp(),
        city: userCity,
        category: selectedResource.category,
        urgencyNote: urgencyNote.trim() || null,
        deliveryAddress: deliveryAddress.trim() || null,
        contactNumber: contactNumber.trim(),
      })
      setModalOpen(false)
    } catch {
      setError("Failed to submit request")
    }
    setProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Resources </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {userCity} • {filteredResources.filter((r) => r.available > 0).length} Available Resources
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={tab} onValueChange={v => setTab(v as any)} className="w-full">
              <TabsList className="w-full rounded-none border-b bg-transparent p-0">
                <TabsTrigger 
                  value="resources" 
                  className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                >
                  Available Resources
                </TabsTrigger>
                <TabsTrigger 
                  value="requests" 
                  className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                >
                  My Requests
                </TabsTrigger>
              </TabsList>
              <div className="p-6">
                <TabsContent value="resources">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                      size="sm"
                      variant={availabilityFilter === "available" ? "default" : "outline"}
                      onClick={() => setAvailabilityFilter("available")}
                    >
                      Available
                    </Button>
                    <Button
                      size="sm"
                      variant={availabilityFilter === "unavailable" ? "default" : "outline"}
                      onClick={() => setAvailabilityFilter("unavailable")}
                    >
                      Unavailable
                    </Button>
                    <Button
                      size="sm"
                      variant={categoryFilter === "all" ? "default" : "outline"}
                      onClick={() => setCategoryFilter("all")}
                    >
                      All Categories
                    </Button>
                    {RESOURCE_CATEGORIES.map(cat => (
                      <Button
                        key={cat.id}
                        size="sm"
                        variant={categoryFilter === cat.id ? "default" : "outline"}
                        onClick={() => setCategoryFilter(cat.id)}
                        className="flex items-center gap-1"
                      >
                        {cat.icon}
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Resource List */}
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                  ) : filteredResources.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-500 py-12">
                      <AlertTriangle className="mx-auto mb-2 w-8 h-8 text-yellow-500" />
                      No resources found for your filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.map(resource => {
                        const isAvailable = resource.available > 0
                        const stockPercent = Math.round((resource.available / resource.total) * 100)
                        const category = RESOURCE_CATEGORIES.find(cat => cat.id === resource.category)
                        return (
                          <Card key={resource.id} className={`relative overflow-hidden transition-all hover:shadow-md ${!isAvailable ? "opacity-70" : ""}`}>
                            <div className="absolute top-3 right-3">
                              <Badge className={PRIORITY_COLORS[resource.priority]}>{resource.priority.toUpperCase()}</Badge>
                            </div>
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                  {category?.icon || <Package className="w-5 h-5" />}
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">{resource.name}</h3>
                                  <p className="text-sm text-gray-500">{category?.name || resource.category}</p>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{resource.description}</p>
                              
                              <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-500">Available:</span>
                                  <span className={`font-medium ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                                    {resource.available} of {resource.total}
                                  </span>
                                </div>
                                <Progress value={stockPercent} className="h-2" />
                              </div>
                              
                              <Button
                                size="sm"
                                className="w-full mt-2"
                                disabled={!isAvailable}
                                onClick={() => openRequestModal(resource)}
                              >
                                {isAvailable ? "Request Resource" : "Out of Stock"}
                              </Button>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="requests">
                  {/* My Requests */}
                  <div className="space-y-4">
                    {myRequests.length === 0 ? (
                      <div className="text-center text-gray-500 py-12">
                        <CheckCircle2 className="mx-auto mb-2 w-8 h-8 text-gray-400" />
                        You haven't made any requests yet.
                      </div>
                    ) : (
                      myRequests.map(req => (
                        <Card key={req.id} className="relative overflow-hidden hover:shadow-md transition-all">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-lg">{req.resourceName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={STATUS_COLORS[req.status]}>{req.status.toUpperCase()}</Badge>
                                  <Badge className={PRIORITY_COLORS[req.priority]}>{req.priority.toUpperCase()}</Badge>
                                </div>
                              </div>
                              <span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {req.quantity} units
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Requested</p>
                                <p className="text-sm">
                                  {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleString() : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Contact</p>
                                <p className="text-sm">{req.contactNumber}</p>
                              </div>
                            </div>
                            
                            {req.urgencyNote && (
                              <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">Urgency Note</p>
                                <p className="text-sm text-yellow-700">{req.urgencyNote}</p>
                              </div>
                            )}
                            
                            {req.deliveryAddress && (
                              <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                                <p className="text-sm text-blue-700">{req.deliveryAddress}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Request Modal */}
      {modalOpen && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4">
            <form
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
              onSubmit={handleSubmitRequest}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request Resource</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Available: <span className="font-medium text-green-600">{selectedResource.available}</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => setModalOpen(false)}
                  tabIndex={-1}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Modal body (scrollable) */}
              <div className="overflow-y-auto px-6 py-4 flex-1">
                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">{selectedResource.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedResource.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity Needed *</label>
                  <Input
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder={`Max: ${selectedResource.available}`}
                    type="number"
                    min={1}
                    max={selectedResource.available}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number *</label>
                  <Input
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    placeholder="Your contact number"
                    required
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority Level</label>
                  <div className="flex flex-wrap gap-2">
                    {(["low", "medium", "high", "critical"] as const).map(p => (
                      <Button
                        key={p}
                        type="button"
                        size="sm"
                        variant={priority === p ? "default" : "outline"}
                        className={`${priority === p ? PRIORITY_COLORS[p] : ""} capitalize`}
                        onClick={() => setPriority(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Address</label>
                  <Textarea
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="Where should we deliver this resource?"
                    rows={2}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urgency Note (Optional)</label>
                  <Textarea
                    value={urgencyNote}
                    onChange={e => setUrgencyNote(e.target.value)}
                    placeholder="Explain why you need this resource urgently"
                    rows={2}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-md mt-4">
                    {error}
                  </div>
                )}
              </div>
              {/* Modal footer (sticky submit button) */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}