'use client'
import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  increment,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useRef } from "react";

// Types
type Resource = {
  id: string;
  name: string;
  description: string;
  available: number;
  total: number;
  city: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  imageUrl?: string;
  createdAt: any;
  lastUpdated?: any;
  minThreshold: number;
  createdBy: string;
};

type ResourceRequest = {
  id: string;
  resourceId: string;
  resourceName: string;
  quantity: number;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: any;
  processedAt?: any;
  processedBy?: string;
  city: string;
  category: string;
  urgencyNote?: string;
  deliveryAddress?: string;
  contactNumber: string;
};

// Resource Categories
const RESOURCE_CATEGORIES = [
  { id: "medical", name: "Medical Supplies", icon: "medical-bag", color: "#ef4444" },
  { id: "food", name: "Food & Water", icon: "food-apple", color: "#10b981" },
  { id: "shelter", name: "Shelter & Clothing", icon: "home-variant", color: "#3b82f6" },
  { id: "rescue", name: "Rescue Equipment", icon: "lifebuoy", color: "#f59e0b" },
  { id: "communication", name: "Communication", icon: "radio", color: "#8b5cf6" },
  { id: "transportation", name: "Transportation", icon: "car", color: "#06b6d4" },
  { id: "tools", name: "Tools & Equipment", icon: "hammer-wrench", color: "#84cc16" },
  { id: "energy", name: "Power & Fuel", icon: "lightning-bolt", color: "#f97316" },
];

// Disaster Resources
const DISASTER_RESOURCES = {
  medical: [
    "First Aid Kits",
    "Bandages",
    "Antiseptics",
    "Pain Relievers",
    "Antibiotics",
    "Blood Bags",
    "Oxygen Tanks",
    "Stretchers",
    "Defibrillators",
    "Surgical Kits",
  ],
  food: [
    "Drinking Water",
    "Canned Food",
    "Dry Rations",
    "Baby Formula",
    "Energy Bars",
    "Water Purification Tablets",
    "Cooking Gas",
    "Emergency Food Packets",
  ],
  shelter: [
    "Tents",
    "Blankets",
    "Sleeping Bags",
    "Tarpaulins",
    "Emergency Clothing",
    "Mattresses",
    "Pillows",
    "Raincoats",
    "Winter Jackets",
  ],
  rescue: [
    "Life Jackets",
    "Ropes",
    "Helmets",
    "Flashlights",
    "Megaphones",
    "Rescue Boats",
    "Ladders",
    "Cutting Tools",
    "Safety Harnesses",
  ],
  communication: [
    "Walkie Talkies",
    "Satellite Phones",
    "Emergency Radios",
    "Signal Flares",
    "Whistles",
    "Mobile Chargers",
    "Power Banks",
    "Antennas",
  ],
  transportation: [
    "Ambulances",
    "Rescue Vehicles",
    "Boats",
    "Helicopters",
    "Motorcycles",
    "Bicycles",
    "Fuel",
    "Vehicle Parts",
  ],
  tools: [
    "Generators",
    "Chainsaws",
    "Shovels",
    "Pickaxes",
    "Crowbars",
    "Tool Kits",
    "Heavy Machinery",
    "Pumps",
    "Hoses",
  ],
  energy: [
    "Portable Generators",
    "Solar Panels",
    "Batteries",
    "Fuel Cans",
    "Power Cables",
    "Inverters",
    "Emergency Lights",
    "Charging Stations",
  ],
};

// Priority Colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f59e0b";
    case "medium":
      return "#3b82f6";
    case "low":
      return "#10b981";
    default:
      return "#64748b";
  }
};

// Status Colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "#10b981";
    case "rejected":
      return "#ef4444";
    case "fulfilled":
      return "#8b5cf6";
    case "pending":
      return "#f59e0b";
    default:
      return "#64748b";
  }
};

// Custom Components
const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
}) => {
  const baseClasses = "py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ""} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const Badge = ({
  children,
  color,
  className = "",
}: {
  children: React.ReactNode;
  color: string;
  className?: string;
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {children}
    </span>
  );
};

const ProgressBar = ({ value, max = 100, color }: { value: number; max?: number; color: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className="h-2 rounded-full"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      ></div>
    </div>
  );
};

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </div>
          {actions && (
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Tabs = ({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (tabId: string) => void;
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

const Chip = ({
  label,
  color,
  icon,
  active,
  onClick,
}: {
  label: string;
  color: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 transition-colors ${
        active ? "text-white" : "text-gray-800 dark:text-gray-200"
      }`}
      style={{
        backgroundColor: active ? color : "rgba(0, 0, 0, 0.05)",
        border: `1px solid ${color}`,
      }}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </button>
  );
};

const AdminResourcesScreen = () => {
  // Add Stock Modal state and logic
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const [addStockResource, setAddStockResource] = useState<Resource | null>(null);
  const [addStockQuantity, setAddStockQuantity] = useState(1);
  const [addStockProcessing, setAddStockProcessing] = useState(false);

  const openAddStockModal = (resource: Resource) => {
    setAddStockResource(resource);
    setAddStockQuantity(1);
    setAddStockModalOpen(true);
  };

  const closeAddStockModal = () => {
    setAddStockModalOpen(false);
    setAddStockResource(null);
    setAddStockQuantity(1);
  };

  const submitAddStock = async () => {
    if (!addStockResource || addStockQuantity <= 0) return;
    setAddStockProcessing(true);
    try {
      await handleAddStock(addStockResource.id, addStockQuantity);
      showSnackbar(`Added ${addStockQuantity} units to ${addStockResource.name}`);
      closeAddStockModal();
    } catch (e) {
      showSnackbar("Failed to add stock");
    } finally {
      setAddStockProcessing(false);
    }
  };
  const currentUser = auth.currentUser;
  const [resources, setResources] = useState<Resource[]>([]);
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  // No imageUploading/resourceImages needed for base64

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState("");
  const [available, setAvailable] = useState("");
  const [category, setCategory] = useState("medical");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [minThreshold, setMinThreshold] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [selectedQuickAdd, setSelectedQuickAdd] = useState<string | null>(null);

  // Filter states
  const [activeTab, setActiveTab] = useState<"resources" | "requests">("resources");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [requestFilter, setRequestFilter] = useState("pending");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [adminCity, setAdminCity] = useState<string>("");

  useEffect(() => {
    const fetchAdminCity = async () => {
      if (!currentUser) return;
      try {
        const adminDoc = await getDoc(doc(db, "admins", currentUser.uid));
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          setAdminCity(data.city || "DefaultCity");
        } else {
          setAdminCity("DefaultCity");
        }
      } catch (e) {
        setAdminCity("DefaultCity");
      }
    };
    fetchAdminCity();
  }, [currentUser]);

  // Fetch resources and requests from Firestore (city-specific)
  useEffect(() => {
    if (!adminCity) return;

    setLoading(true);

    // Resources query - only for admin's city
    const resourcesQuery = query(
      collection(db, "resources"),
      where("city", "==", adminCity),
      orderBy("name", "asc")
    );

    const resourcesUnsub = onSnapshot(
      resourcesQuery,
      (snapshot) => {
        const data: Resource[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Resource);
        });
        setResources(data);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error("Error fetching resources:", error);
        showSnackbar("Failed to load resources");
        setLoading(false);
        setRefreshing(false);
      }
    );

    // Requests query - only for admin's city
    const requestsQuery = query(
      collection(db, "requests"),
      where("city", "==", adminCity),
      orderBy("createdAt", "desc")
    );

    const requestsUnsub = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const data: ResourceRequest[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as ResourceRequest);
        });
        setRequests(data);
      },
      (error) => {
        console.error("Error fetching requests:", error);
        showSnackbar("Failed to load requests");
      }
    );

    return () => {
      resourcesUnsub();
      requestsUnsub();
    };
  }, [adminCity]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const openAddModal = () => {
    setMode("add");
    setName("");
    setDescription("");
    setTotal("");
    setAvailable("");
    setCategory("medical");
    setPriority("medium");
    setMinThreshold("");
    setImageUri("");
    setSelectedQuickAdd(null);
    setModalVisible(true);
  };

  const openEditModal = (resource: Resource) => {
    setMode("edit");
    setSelectedResource(resource);
    setName(resource.name);
    setDescription(resource.description);
    setTotal(resource.total.toString());
    setAvailable(resource.available.toString());
    setCategory(resource.category);
    setPriority(resource.priority);
    setMinThreshold(resource.minThreshold?.toString() || "");
    setImageUri(resource.imageUrl || "");
    setSelectedQuickAdd(null);
    setModalVisible(true);
  };

  const openRequestModal = (request: ResourceRequest) => {
    setSelectedRequest(request);
    setRequestModalVisible(true);
  };

  // Simple file input for base64 image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // No storeResourceImage needed, use base64 only

  const handleSubmit = async () => {
    if (!name.trim()) {
      showSnackbar("Resource name is required");
      return;
    }
    if (!total.trim() || isNaN(Number(total)) || Number(total) <= 0) {
      showSnackbar("Please enter a valid total quantity");
      return;
    }
    if (!available.trim() || isNaN(Number(available)) || Number(available) < 0) {
      showSnackbar("Please enter a valid available quantity");
      return;
    }
    if (Number(available) > Number(total)) {
      showSnackbar("Available cannot be greater than total");
      return;
    }

    setProcessing(true);
    try {
      // Use base64 image directly
      const resourceData = {
        name: name.trim(),
        description: description.trim(),
        total: Number(total),
        available: Number(available),
        city: adminCity,
        category,
        priority,
        minThreshold: Number(minThreshold) || 5,
        imageUrl: imageUri || null,
        lastUpdated: new Date(),
        createdBy: currentUser?.uid,
        ...(mode === "add" && { createdAt: new Date() }),
      };

      if (mode === "add") {
        await addDoc(collection(db, "resources"), resourceData);
        showSnackbar("Resource added successfully");
      } else if (selectedResource) {
        await updateDoc(doc(db, "resources", selectedResource.id), resourceData);
        showSnackbar("Resource updated successfully");
      }

      setModalVisible(false);
    } catch (error) {
      console.error("Error saving resource:", error);
      showSnackbar("Failed to save resource");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedResource) return;

    if (confirm(`Are you sure you want to delete ${selectedResource.name}?`)) {
      try {
        await deleteDoc(doc(db, "resources", selectedResource.id));
        showSnackbar("Resource deleted successfully");
        setModalVisible(false);
      } catch (error) {
        console.error("Error deleting resource:", error);
        showSnackbar("Failed to delete resource");
      }
    }
  };

  const handleRequestAction = async (action: "approve" | "reject" | "fulfill") => {
    if (!selectedRequest) return;

    setProcessing(true);
    try {
      const updateData: any = {
        status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "fulfilled",
        processedAt: new Date(),
        processedBy: currentUser?.uid,
      };

      await updateDoc(doc(db, "requests", selectedRequest.id), updateData);

      // If approved or fulfilled, update resource availability
      if (action === "approve" || action === "fulfill") {
        const resource = resources.find(
          (r) => r.id === selectedRequest.resourceId || r.name === selectedRequest.resourceName
        );

        if (resource) {
          const newAvailable = resource.available - selectedRequest.quantity;
          if (newAvailable < 0) {
            showSnackbar("Not enough resources available");
            return;
          }

          await updateDoc(doc(db, "resources", resource.id), {
            available: newAvailable,
            lastUpdated: new Date(),
          });

          // Create notification for user
          await addDoc(collection(db, "notifications"), {
            userId: selectedRequest.userId,
            title: `Request ${action === "approve" ? "Approved" : "Fulfilled"}`,
            message: `Your request for ${selectedRequest.quantity} ${selectedRequest.resourceName} has been ${
              action === "approve" ? "approved" : "fulfilled"
            }.`,
            type: action === "approve" ? "approval" : "fulfillment",
            resourceId: resource.id,
            requestId: selectedRequest.id,
            createdAt: new Date(),
            read: false,
            city: adminCity,
          });
        }
      }

      showSnackbar(
        `Request ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "fulfilled"}`
      );
      setRequestModalVisible(false);
    } catch (error) {
      console.error("Error processing request:", error);
      showSnackbar("Failed to process request");
    } finally {
      setProcessing(false);
    }
  };

  const handleAddStock = async (resourceId: string, additionalQuantity: number) => {
    try {
      await updateDoc(doc(db, "resources", resourceId), {
        available: increment(additionalQuantity),
        total: increment(additionalQuantity),
        lastUpdated: new Date(),
      });
      showSnackbar(`Added ${additionalQuantity} units successfully`);
    } catch (error) {
      console.error("Error adding stock:", error);
      showSnackbar("Failed to add stock");
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "medical": return <span role="img" aria-label="medical">🩺</span>;
      case "food": return <span role="img" aria-label="food">🍎</span>;
      case "shelter": return <span role="img" aria-label="shelter">🏠</span>;
      case "rescue": return <span role="img" aria-label="rescue">🛟</span>;
      case "communication": return <span role="img" aria-label="communication">📡</span>;
      case "transportation": return <span role="img" aria-label="transportation">🚗</span>;
      case "tools": return <span role="img" aria-label="tools">🛠️</span>;
      case "energy": return <span role="img" aria-label="energy">⚡</span>;
      default: return <span role="img" aria-label="inventory">📦</span>;
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = RESOURCE_CATEGORIES.find((cat) => cat.id === categoryId);
    return category ? category.color : "#3b82f6";
  };

  const renderResourceItem = (item: Resource) => {
    const isLowStock = item.available <= item.minThreshold;
    const stockPercentage = (item.available / item.total) * 100;

    return (
      <Card key={item.id} className="mb-4 hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {getCategoryIcon(item.category)}
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                {RESOURCE_CATEGORIES.find((cat) => cat.id === item.category)?.name || item.category}
              </span>
            </div>
            <Badge color={getPriorityColor(item.priority)}>
              {item.priority.toUpperCase()}
            </Badge>
          </div>

          <div className="flex">
            {item.imageUrl && (
              <div className="w-20 h-20 mr-4 flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">
                    Available:{" "}
                    <span
                      className="font-semibold"
                      style={{ color: isLowStock ? "#ef4444" : "#10b981" }}
                    >
                      {item.available}
                    </span>
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">Total: {item.total}</span>
                </div>

                <ProgressBar
                  value={stockPercentage}
                  color={isLowStock ? "#ef4444" : "#10b981"}
                />

                {isLowStock && (
                  <div className="flex items-center mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                    <span className="mr-1">⚠️</span>
                    <span>Low Stock</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                <Button
                  variant="secondary"
                  onClick={() => openAddStockModal(item)}
                  startIcon={<span>➕</span>}
                >
                  Add Stock
                </Button>
                <Button
                  variant="primary"
                  onClick={() => openEditModal(item)}
                  className="ml-2"
                >
                  Edit
                </Button>
              </div>
      {/* Add Stock Modal */}
      <Modal
        open={addStockModalOpen}
        onClose={closeAddStockModal}
        title={addStockResource ? `Add Stock to ${addStockResource.name}` : "Add Stock"}
        actions={
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={closeAddStockModal} disabled={addStockProcessing}>Cancel</Button>
            <Button
              variant="primary"
              onClick={submitAddStock}
              disabled={addStockProcessing || addStockQuantity <= 0}
              startIcon={addStockProcessing ? <span className="animate-spin">⏳</span> : <span>💾</span>}
            >
              Add
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity to Add
          </label>
          <input
            type="number"
            min={1}
            value={addStockQuantity}
            onChange={e => setAddStockQuantity(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter quantity"
            disabled={addStockProcessing}
          />
        </div>
      </Modal>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderRequestItem = (item: ResourceRequest) => (
    <Card key={item.id} className="mb-4 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <Badge color={getStatusColor(item.status)}>{item.status.toUpperCase()}</Badge>
          <Badge color={getPriorityColor(item.priority)}>
            {item.priority.toUpperCase()}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.resourceName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Quantity: {item.quantity} units
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Requested by: {item.userName || "Unknown User"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Contact: {item.contactNumber}
        </p>
        {item.urgencyNote && (
          <div className="mt-2 flex items-start text-sm text-yellow-600 dark:text-yellow-400">
            <span className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0">⚠️</span>
            <span>Note: {item.urgencyNote}</span>
          </div>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : "N/A"}
        </p>

        <div className="mt-4">
          <Button
            variant="primary"
            onClick={() => openRequestModal(item)}
            fullWidth
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );

  const filteredResources = resources.filter((resource) => {
    if (categoryFilter !== "all" && resource.category !== categoryFilter) return false;
    if (resourceFilter === "available") return resource.available > 0;
    if (resourceFilter === "low") return resource.available <= resource.minThreshold;
    if (resourceFilter === "critical") return resource.priority === "critical";
    return true;
  });

  const filteredRequests = requests.filter((request) => {
    if (requestFilter === "all") return true;
    return request.status === requestFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Resource Center
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {adminCity} • {resources.length} Resources •{" "}
              {requests.filter((r) => r.status === "pending").length} Pending
            </p>
          </div>
          <Button
            variant="primary"
            onClick={openAddModal}
            startIcon={<span>➕</span>}
          >
            Add Resource
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <Tabs
          tabs={[
            {
              id: "resources",
              label: "Resources",
              count: filteredResources.length,
            },
            {
              id: "requests",
              label: "Requests",
              count: filteredRequests.length,
            },
          ]}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as "resources" | "requests")}
        />

        {/* Filters */}
        <div className="mt-4 mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {activeTab === "resources" ? (
              <>
                {["all", "available", "low", "critical"].map((filter) => (
                  <Chip
                    key={filter}
                    label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                    color="#3b82f6"
                    active={resourceFilter === filter}
                    onClick={() => setResourceFilter(filter)}
                  />
                ))}

                {RESOURCE_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    color={cat.color}
                    icon={getCategoryIcon(cat.id)}
                    active={categoryFilter === cat.id}
                    onClick={() =>
                      setCategoryFilter(categoryFilter === cat.id ? "all" : cat.id)
                    }
                  />
                ))}
              </>
            ) : (
              ["all", "pending", "approved", "rejected"].map((filter) => (
                <Chip
                  key={filter}
                  label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                  color={
                    filter === "pending"
                      ? "#f59e0b"
                      : filter === "approved"
                      ? "#10b981"
                      : filter === "rejected"
                      ? "#ef4444"
                      : "#3b82f6"
                  }
                  active={requestFilter === filter}
                  onClick={() => setRequestFilter(filter)}
                />
              ))
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
          </div>
        ) : activeTab === "resources" ? (
          <div>
            {filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <span className="mx-auto h-12 w-12 text-gray-400 text-4xl">📦</span>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  No resources found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by adding a new resource.
                </p>
                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={openAddModal}
                    startIcon={<span>➕</span>}
                  >
                    Add Resource
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {filteredResources.map((resource) => renderResourceItem(resource))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <span className="mx-auto h-12 w-12 text-gray-400 text-4xl">📋</span>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  No requests found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  All requests are processed.
                </p>
              </div>
            ) : (
              <div>
                {filteredRequests.map((request) => renderRequestItem(request))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Resource Modal */}
      <Modal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        title={mode === "add" ? "Add Resource" : "Edit Resource"}
        actions={
          <div className="flex justify-between w-full">
            {mode === "edit" && (
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={processing}
                startIcon={<span>🗑️</span>}
              >
                Delete
              </Button>
            )}
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => setModalVisible(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={processing}
                startIcon={processing ? <span className="animate-spin">⏳</span> : <span>💾</span>}
              >
                {mode === "add" ? "Add Resource" : "Save Changes"}
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer" style={{ borderColor: "#d1d5db" }}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imageUri ? (
              <img
                src={imageUri}
                alt="Resource preview"
                className="mx-auto max-h-40 rounded-lg"
              />
            ) : (
              <div className="py-8">
                <span className="mx-auto h-12 w-12 text-gray-400 text-4xl">📷</span>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Click to select an image
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Recommended size: 800x600px
                </p>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resource Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter resource name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter description"
                  rows={3}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Quantity *
                  </label>
                  <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Available *
                  </label>
                  <input
                    type="number"
                    value={available}
                    onChange={(e) => setAvailable(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Threshold
                </label>
                <input
                  type="number"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="5"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Classification
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <div className="flex flex-wrap gap-2">
                  {RESOURCE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                        category === cat.id
                          ? "text-white"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                      style={{
                        backgroundColor: category === cat.id ? cat.color : "rgba(0, 0, 0, 0.05)",
                        border: `1px solid ${cat.color}`,
                      }}
                    >
                      {getCategoryIcon(cat.id)}
                      <span className="ml-1">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority Level *
                </label>
                <div className="flex flex-wrap gap-2">
                  {["low", "medium", "high", "critical"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p as any)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        priority === p ? "text-white" : "text-gray-800 dark:text-gray-200"
                      }`}
                      style={{
                        backgroundColor:
                          priority === p ? getPriorityColor(p) : "rgba(0, 0, 0, 0.05)",
                        border: `1px solid ${getPriorityColor(p)}`,
                      }}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Add Suggestions */}
          {category && DISASTER_RESOURCES[category as keyof typeof DISASTER_RESOURCES] && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {DISASTER_RESOURCES[category as keyof typeof DISASTER_RESOURCES].map(
                  (resourceName) => (
                    <button
                      key={resourceName}
                      onClick={() => {
                        setName(resourceName);
                        setSelectedQuickAdd(resourceName);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedQuickAdd === resourceName
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {resourceName}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Request Modal */}
      <Modal
        open={requestModalVisible}
        onClose={() => setRequestModalVisible(false)}
        title="Request Details"
        actions={
          (selectedRequest?.status === "pending" || selectedRequest?.status === "approved") && (
            <div className="flex justify-end space-x-2">
              {selectedRequest?.status === "pending" && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => handleRequestAction("reject")}
                    disabled={processing}
                    startIcon={processing ? <span className="animate-spin">⏳</span> : <span>❌</span>}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleRequestAction("approve")}
                    disabled={processing}
                    startIcon={processing ? <span className="animate-spin">⏳</span> : <span>✔️</span>}
                  >
                    Approve
                  </Button>
                </>
              )}
              {selectedRequest?.status === "approved" && (
                <Button
                  variant="primary"
                  onClick={() => handleRequestAction("fulfill")}
                  disabled={processing}
                  startIcon={processing ? <span className="animate-spin">⏳</span> : <span>✅</span>}
                >
                  Mark as Fulfilled
                </Button>
              )}
            </div>
          )
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedRequest.resourceName}
              </h3>
              <Badge color={getStatusColor(selectedRequest.status)}>
                {selectedRequest.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                  <span className="text-blue-600 dark:text-blue-300 text-xl">📦</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedRequest.quantity} units
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-3">
                  <span className="text-purple-600 dark:text-purple-300 text-xl">👤</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Requester</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedRequest.userName || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                  <span className="text-green-600 dark:text-green-300 text-xl">📞</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedRequest.contactNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg mr-3">
                  <span className="text-yellow-600 dark:text-yellow-300 text-xl">🚩</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                  <p
                    className="font-medium"
                    style={{ color: getPriorityColor(selectedRequest.priority) }}
                  >
                    {selectedRequest.priority.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                  <span className="text-gray-600 dark:text-gray-300 text-xl">⏰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Requested</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedRequest.createdAt?.toDate
                      ? selectedRequest.createdAt.toDate().toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {selectedRequest.deliveryAddress && (
                <div className="flex items-start">
                  <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg mr-3">
                    <span className="text-red-600 dark:text-red-300 text-xl">📍</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Delivery Address
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedRequest.deliveryAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedRequest.urgencyNote && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg flex">
                <span className="text-yellow-500 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0">⚠️</span>
                <p className="text-yellow-700 dark:text-yellow-400">
                  {selectedRequest.urgencyNote}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Snackbar */}
      {snackbarVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center border border-gray-200 dark:border-gray-700">
            <span className="text-blue-500 mr-2">ℹ️</span>
            <span className="text-gray-800 dark:text-white">{snackbarMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResourcesScreen;
function useDropzone({
  onDrop,
  accept,
  maxFiles,
}: {
  onDrop: (acceptedFiles: File[]) => void;
  accept: { "image/*": string[] };
  maxFiles: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const accepted: File[] = [];
    for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
      const file = files[i];
      // Accept only allowed types/extensions
      const allowedExts = accept["image/*"];
      if (
        allowedExts.some((ext) =>
          file.name.toLowerCase().endsWith(ext)
        )
      ) {
        accepted.push(file);
      }
    }
    if (accepted.length > 0) {
      onDrop(accepted);
    }
  };

  const getRootProps = () => ({
    onClick: openFileDialog,
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleFiles(e.dataTransfer.files);
    },
    tabIndex: 0,
    role: "button",
    style: { cursor: "pointer" },
  });

  const getInputProps = () => ({
    type: "file",
    accept: accept["image/*"].join(","),
    multiple: maxFiles > 1,
    ref: inputRef,
    style: { display: "none" },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  return { getRootProps, getInputProps };
}
