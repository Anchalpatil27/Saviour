import React from 'react';

const safetyRules = [
  { icon: "📻", text: "Stay informed: Listen to weather updates and alerts from IMD or local authorities." },
  { icon: "🏞️", text: "Move to higher ground immediately if you are in a flood-prone area." },
  { icon: "🚷", text: "Avoid walking/driving through floodwaters (just 6 inches can knock you down)." },
  { icon: "🧰", text: "Keep emergency supplies ready: water, food, torch, batteries, first aid kit, and documents." },
  { icon: "⚡", text: "Disconnect electrical appliances to prevent shock." },
  { icon: "👵", text: "Help children, elderly, and differently-abled persons to safety first." },
  { icon: "💧", text: "Don't touch electrical equipment if wet or standing in water." },
  { icon: "🚨", text: "Follow evacuation orders from authorities without delay." },
  { icon: "📱", text: "Keep mobile charged and emergency numbers handy." },
  { icon: "🏚️", text: "After flood, avoid damaged buildings until declared safe by officials." }
];

const emergencyContacts = [
  { name: "Disaster Management", number: "1078" },
  { name: "National Emergency", number: "112" },
  { name: "Ambulance", number: "108" },
  { name: "Police", number: "100" }
];

const emergencyKitItems = [
  "Drinking water (3L per person per day)",
  "Non-perishable food (3-day supply)",
  "First aid kit + medicines",
  "Waterproof torch + extra batteries",
  "Important documents in waterproof bag",
  "Cash (ATMs may not work)",
  "Portable phone charger",
  "Multi-tool/knife",
  "Rain gear and warm clothes"
];

export default function FloodSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-200 dark:border-blue-700">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl text-blue-600">🌊</span>
            <div>
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100">Flood Safety Guide (India)</h2>
              <p className="text-blue-600 dark:text-blue-300 text-sm">IMD Flood Alert: Follow official warnings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-blue-500 dark:text-blue-300 hover:text-red-500 text-3xl font-bold transition"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-blue-100 dark:bg-blue-800/50 rounded-lg p-3 mb-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
            <span className="text-xl">🚨</span>
            Emergency Contacts
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {emergencyContacts.map((contact, idx) => (
              <a 
                key={idx}
                href={`tel:${contact.number}`}
                className="bg-white dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-blue-900 p-2 rounded flex items-center justify-between transition"
              >
                <span className="text-sm font-medium">{contact.name}</span>
                <span className="font-bold text-blue-600 dark:text-blue-300">{contact.number}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Safety Rules */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-100 mb-3 flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            Flood Safety Rules
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {safetyRules.map((rule, idx) => (
              <li key={idx} className="bg-white/80 dark:bg-blue-800/80 p-3 rounded-lg shadow-sm flex items-start gap-3">
                <span className="text-2xl">{rule.icon}</span>
                <span className="text-blue-900 dark:text-blue-100">{rule.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency Kit */}
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 mb-4">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
            <span className="text-xl">🧳</span>
            Emergency Kit Essentials
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {emergencyKitItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-green-800 dark:text-green-100">
                <span>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Video Section */}
        <section>
          <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-300">Watch:  Flood Safety Protocol</h3>
          <video width="100%" height="200" controls className="rounded-lg shadow mb-4">
            <source src="/safety-videos/flood_safety.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          </section>

        {/* After Flood Precautions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            After Flood Precautions
          </h3>
          <ul className="space-y-1 text-yellow-800 dark:text-yellow-100">
            <li className="flex items-start gap-2">• Boil drinking water until authorities declare it safe</li>
            <li className="flex items-start gap-2">• Watch for snakes and other displaced animals</li>
            <li className="flex items-start gap-2">• Document damage for insurance claims</li>
            <li className="flex items-start gap-2">• Clean and disinfect everything that got wet</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-blue-600 dark:text-blue-300 mt-4">
          For real-time flood alerts, visit mausam.imd.gov.in or download the IMD app
        </div>
      </div>
    </div>
  );
}