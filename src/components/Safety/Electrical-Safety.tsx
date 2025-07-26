import React from "react";

const electricalSafetyRules = [
  { icon: "⚡", text: "Always turn off power at the mains before working on electrical circuits." },
  { icon: "💧", text: "Never touch electrical appliances with wet hands or while standing on wet surfaces." },
  { icon: "🧰", text: "Use proper insulated tools when handling electrical wiring." },
  { icon: "🪢", text: "Replace frayed or damaged cords immediately - don't tape over them." },
  { icon: "🔌", text: "Use sockets safely - don't overload them with multiple adapters." },
  { icon: "🧒", text: "Install child safety caps on all unused electrical outlets." },
  { icon: "🚱", text: "Keep electrical devices away from water sources (bathrooms, kitchens)." },
  { icon: "✅", text: "Use appliances with ISI mark certification for safety standards." },
  { icon: "🖐️", text: "Never yank cords from the wall - pull by the plug instead." },
  { icon: "🌩️", text: "During storms/unstable power, unplug sensitive electronics." },
  { icon: "💡", text: "Use proper wattage bulbs in light fixtures to prevent overheating." },
  { icon: "🗺️", text: "Know your home's circuit breaker locations and how to reset them." },
  { icon: "🥄", text: "Never use metal objects to retrieve items from appliances (like toasters)." },
  { icon: "🚑", text: "If someone receives electric shock: Don't touch them directly - turn off power first." },
  { icon: "🛡️", text: "Install Residual Current Circuit Breakers (RCCB) for added protection." },
  { icon: "🔥", text: "Regularly check for hot switches/outlets which indicate wiring problems." }
];

const electricalKitItems = [
  "ISI marked extension cords",
  "Insulated screwdrivers",
  "Voltage tester",
  "Circuit breaker map",
  "Emergency electrician contact",
  "First aid kit",
  "Flashlight",
  "RCCB device"
];

const emergencyContacts = [
  { name: "Electricity Emergency", number: "1912" },
  { name: "Fire Department", number: "101" },
  { name: "Ambulance", number: "108" }
];

const electricalSafetyTips = [
  "Never ignore burning smells or sparks from outlets.",
  "Teach children not to play with switches or cords.",
  "Unplug appliances when not in use.",
  "Keep a voltage tester handy.",
  "Schedule annual electrical inspections for old homes."
];

export default function ElectricalSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all animate-fade-in" onClick={onClose} aria-modal="true" role="dialog">
      <div className="relative bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-gray-200 dark:border-gray-700 glassmorphic max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-3xl font-bold focus:outline-none transition" onClick={onClose} aria-label="Close">×</button>
        <div className="flex items-center gap-3 mb-4">
          <span role="img" aria-label="electric" className="text-4xl">⚡</span>
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">Electrical Safety Guide</h2>
        </div>
        <div className="mb-4 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/40 flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="font-medium text-purple-700 dark:text-purple-300">Electricity can kill instantly—always prioritize safety!</span>
        </div>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-300">Critical Electrical Safety Rules:</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {electricalSafetyRules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg px-3 py-2">
              <span className="text-xl">{rule.icon}</span>
              <span>{rule.text}</span>
            </li>
          ))}
        </ul>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-300">Recommended Electrical Safety Kit:</h3>
        <ul className="grid grid-cols-2 gap-2 mb-4">
          {electricalKitItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg px-3 py-2">
              <span className="text-xl">🧰</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-300">Emergency Contacts:</h3>
        <ul className="mb-4">
          {emergencyContacts.map((contact, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg px-3 py-2 mb-2">
              <span className="text-xl">📞</span>
              <span className="font-medium">{contact.name}:</span>
              <a href={`tel:${contact.number}`} className="text-purple-700 dark:text-purple-300 underline">{contact.number}</a>
            </li>
          ))}
        </ul>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-300">Quick Electrical Safety Tips:</h3>
        <ul className="grid grid-cols-1 gap-2 mb-4">
          {electricalSafetyTips.map((tip, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg px-3 py-2">
              <span className="text-xl">✅</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-300">Watch: Electrical Safety Demo</h3>
        <video width="100%" height="200" controls className="rounded-lg shadow mb-4">
  <source src="/safety-videos/electrical_safety.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
      </div>
    </div>
  );
}