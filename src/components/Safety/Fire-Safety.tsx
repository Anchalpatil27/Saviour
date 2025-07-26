import React from "react";

const fireSafetyRules = [
  { icon: "🔥", text: "Install smoke alarms on every level of your home and test them monthly" },
  { icon: "🏃", text: "Create and practice a fire escape plan with two ways out of every room" },
  { icon: "👨‍🍳", text: "Never leave cooking unattended - it's the #1 cause of home fires" },
  { icon: "🚫", text: "Keep flammable items at least 3 feet away from heat sources" },
  { icon: "🔄", text: "Stop, Drop, and Roll if your clothes catch fire" },
  { icon: "🐍", text: "In case of fire, crawl low under smoke to escape" },
  { icon: "💧", text: "Never use water on grease fires - use a lid or fire extinguisher" },
  { icon: "🧯", text: "Learn how to use a fire extinguisher (PASS method)" },
  { icon: "🔌", text: "Check electrical cords for damage and don't overload outlets" },
  { icon: "🪟", text: "If trapped, seal doors/vents with wet cloth and signal from window" },
  { icon: "🏠", text: "Never re-enter a burning building - wait for firefighters" },
  { icon: "🚸", text: "Keep matches/lighters locked away from children" },
  { icon: "⚡", text: "Turn off/unplug appliances when not in use" },
  { icon: "📞", text: "Know your emergency numbers (101 for fire in India)" }
];

const fireKitItems = [
  "Smoke alarms (one per floor)",
  "Fire extinguisher (ABC type)",
  "Escape ladder (for multi-story homes)",
  "Flashlight with extra batteries",
  "Fireproof document bag",
  "Emergency contact list",
  "First aid kit",
  "Whistle for signaling"
];

const fireEmergencyContacts = [
  { name: "Fire Department", number: "101" },
  { name: "Police", number: "100" },
  { name: "Ambulance", number: "108" },
  { name: "Disaster Management", number: "1078" }
];

const fireSafetyTips = [
  "Test smoke alarms monthly and replace batteries yearly",
  "Practice fire drills with your family twice a year",
  "Keep a fire extinguisher in the kitchen",
  "Teach children how to respond to fire alarms",
  "Know multiple exit routes from your building",
  "Sleep with bedroom doors closed to slow fire spread"
];

export default function FireSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all animate-fade-in" onClick={onClose} aria-modal="true" role="dialog">
      <div className="relative bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-gray-200 dark:border-gray-700 glassmorphic max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-3xl font-bold focus:outline-none transition" onClick={onClose} aria-label="Close">×</button>
        <div className="flex items-center gap-3 mb-4">
          <span role="img" aria-label="fire" className="text-4xl">🔥</span>
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">Fire Safety Guide</h2>
        </div>
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/40 flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="font-medium text-red-700 dark:text-red-300">Fires can spread in seconds. Be prepared and act quickly!</span>
        </div>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-300">Essential Fire Safety Rules:</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {fireSafetyRules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg px-3 py-2">
              <span className="text-xl">{rule.icon}</span>
              <span>{rule.text}</span>
            </li>
          ))}
        </ul>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-300">Recommended Fire Safety Kit:</h3>
        <ul className="grid grid-cols-2 gap-2 mb-4">
          {fireKitItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg px-3 py-2">
              <span className="text-xl">🧰</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-300">Emergency Contacts:</h3>
        <ul className="mb-4">
          {fireEmergencyContacts.map((contact, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg px-3 py-2 mb-2">
              <span className="text-xl">📞</span>
              <span className="font-medium">{contact.name}:</span>
              <a href={`tel:${contact.number}`} className="text-red-700 dark:text-red-300 underline">{contact.number}</a>
            </li>
          ))}
        </ul>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-300">Quick Fire Safety Tips:</h3>
        <ul className="grid grid-cols-1 gap-2 mb-4">
          {fireSafetyTips.map((tip, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg px-3 py-2">
              <span className="text-xl">✅</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-300">Watch: Fire Safety Demo</h3>
            <video width="100%" height="200" controls className="rounded-lg shadow mb-4">
            <source src="/safety-videos/fire_safety.mp4" type="video/mp4" />
            Your browser does not support the video tag.
            </video>
      </div>
    </div>
  );
}