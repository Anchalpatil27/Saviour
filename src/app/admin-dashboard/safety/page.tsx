"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

import ChemicalSafety from "@/components/Safety/Chemical-Safety";
import CycloneSafety from "@/components/Safety/Cyclone-Safety";
import EarthquakeSafety from "@/components/Safety/Earthquake-Safety";
import ElectricalSafety from "@/components/Safety/Electrical-Safety";
import ExtremeColdSafety from "@/components/Safety/Extreme-Cold-Safety";
import ExtremeHeatSafety from "@/components/Safety/Extreme-Heat-Safety";
import FireSafety from "@/components/Safety/Fire-Safety";
import FirstAidTutorial from "@/components/Safety/First-Aid-Tutorial";
import FloodSafety from "@/components/Safety/Flood-Safety";
import LandslideSafety from "@/components/Safety/Landslide-Safety";
import LightningSafety from "@/components/Safety/Lightning-Safety";
import TsunamiSafety from "@/components/Safety/Tsunami-Safety";

const safetyItems = [
  {
    key: "firstaid",
    label: "First Aid",
    icon: "🩺",
    component: FirstAidTutorial,
    desc: "Essential first aid steps",
  },
  {
    key: "flood",
    label: "Flood",
    icon: "🌊",
    component: FloodSafety,
    desc: "Flood safety rules & video",
  },
  {
    key: "earthquake",
    label: "Earthquake",
    icon: "🌏",
    component: EarthquakeSafety,
    desc: "Earthquake safety rules & video",
  },
  {
    key: "fire",
    label: "Fire",
    icon: "🔥",
    component: FireSafety,
    desc: "Fire safety rules & video",
  },
  {
    key: "cyclone",
    label: "Cyclone",
    icon: "🌀",
    component: CycloneSafety,
    desc: "Cyclone safety rules",
  },
  {
    key: "chemical",
    label: "Chemical",
    icon: "🧪",
    component: ChemicalSafety,
    desc: "Chemical safety rules",
  },
  {
    key: "electrical",
    label: "Electrical",
    icon: "⚡",
    component: ElectricalSafety,
    desc: "Electrical safety rules",
  },
  {
    key: "lightning",
    label: "Lightning",
    icon: "🌩️",
    component: LightningSafety,
    desc: "Lightning safety rules",
  },
  {
    key: "landslide",
    label: "Landslide",
    icon: "⛰️",
    component: LandslideSafety,
    desc: "Landslide safety rules",
  },
  {
    key: "tsunami",
    label: "Tsunami",
    icon: "🌊",
    component: TsunamiSafety,
    desc: "Tsunami safety rules",
  },
  {
    key: "extremecold",
    label: "Extreme Cold",
    icon: "❄️",
    component: ExtremeColdSafety,
    desc: "Extreme cold safety rules",
  },
  {
    key: "extremeheat",
    label: "Extreme Heat",
    icon: "🌡️",
    component: ExtremeHeatSafety,
    desc: "Extreme heat safety rules",
  },
];

export default function SafetyScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth restriction
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      setAuthLoading(false);
      if (!firebaseUser) router.push("/auth/login");
      else setUser(firebaseUser);
    });
    return () => unsub();
  }, [router]);

  // Keyboard accessibility for closing modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setVisibleKey(null);
    }
    if (visibleKey) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visibleKey]);

  const filteredItems = safetyItems.filter(item =>
    item.label.toLowerCase().includes(search.trim().toLowerCase())
  );

  const openPopup = (key: string) => setVisibleKey(key);
  const closePopup = () => setVisibleKey(null);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <span className="ml-4 text-lg text-gray-700 dark:text-gray-200">Checking authentication...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          <span role="img" aria-label="shield">🛡️</span>
          Safety Rules
        </h1>
        <div className="flex items-center mb-6 gap-2">
          <span role="img" aria-label="search" className="text-xl">🔍</span>
          <input
            type="text"
            placeholder="Search safety topics..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <button
              key={item.key}
              className="group safety-card bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center cursor-pointer outline-none focus:ring-2 focus:ring-indigo-400"
              onClick={() => openPopup(item.key)}
              tabIndex={0}
              aria-label={item.label}
            >
              <div className="safety-card-icon text-4xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="safety-card-title font-semibold text-lg text-indigo-700 dark:text-indigo-300 mb-1">{item.label}</div>
              <div className="safety-card-desc text-gray-500 dark:text-gray-400 text-sm text-center">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Popups */}
      {safetyItems.map(item => {
        const Comp = item.component;
        return (
          <ModalOverlay key={item.key} open={visibleKey === item.key} onClose={closePopup}>
            <Comp open={visibleKey === item.key} onClose={closePopup} />
          </ModalOverlay>
        );
      })}
    </div>
  );
}

// Modern modal overlay with backdrop and animation
function ModalOverlay({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}