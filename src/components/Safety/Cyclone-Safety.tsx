import React from 'react';

const cycloneSafetyRules = [
  { icon: "🏠", text: "Reinforce your roof with storm shutters or wooden panels" },
  { icon: "🌀", text: "Identify the safest room (usually windowless interior room on lower floor)" },
  { icon: "🍏", text: "Store 3-day supply of dry food and 3 liters water per person daily" },
  { icon: "⚡", text: "Turn off electricity and gas mains when cyclone approaches" },
  { icon: "🚗", text: "Park vehicles under cover, away from trees/power lines" },
  { icon: "⚠️", text: "Learn community warning signals and evacuation routes" },
  { icon: "📱", text: "Keep mobile charged with emergency numbers saved" },
  { icon: "🌊", text: "If in coastal area, move to higher ground immediately when warned" }
];

const cycloneKitItems = [
  "Torch with extra batteries",
  "First aid kit + medicines",
  "Important documents (waterproof bag)",
  "Cash (ATMs may not work)",
  "Emergency contact list",
  "Multi-tool/knife",
  "Portable phone charger",
  "Non-perishable food",
  "Water purification tablets"
];

export default function CycloneSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all animate-fade-in" onClick={onClose} aria-modal="true" role="dialog">
      <div className="relative bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-gray-200 dark:border-gray-700 glassmorphic max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-3xl font-bold focus:outline-none transition" onClick={onClose} aria-label="Close">×</button>
        
        <div className="flex items-center gap-3 mb-4">
          <span role="img" aria-label="cyclone" className="text-4xl">🌀</span>
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Cyclone Safety Guide (India)</h2>
        </div>
        
        <div className="mb-4 px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/40 flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="font-medium text-yellow-700 dark:text-yellow-300">IMD Color Codes: Yellow (Watch), Orange (Alert), Red (Take Action)</span>
        </div>
        
        <div className="divider my-4" />
        
        <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-300">Before Cyclone Season:</h3>
        <ul className="grid grid-cols-1 gap-2 mb-4">
          {cycloneSafetyRules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg px-3 py-2">
              <span className="text-xl">{rule.icon}</span>
              <span>{rule.text}</span>
            </li>
          ))}
        </ul>
        
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-300">Watch: Cyclone Safety Protocol</h3>
          <video width="100%" height="200" controls className="rounded-lg shadow mb-4">
            <source src="/safety-videos/cyclone_safety.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        
        <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-300">Emergency Kit Essentials:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {cycloneKitItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-green-50 dark:bg-green-900/30 rounded-lg px-3 py-2">
              <span className="text-xl">✔️</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        
        <div className="divider my-4" />
        
        <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-300">Do's and Don'ts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
            <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">DO:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">✔️ Stay indoors away from windows</li>
              <li className="flex items-start gap-2">✔️ Listen to All India Radio updates</li>
              <li className="flex items-start gap-2">✔️ Use stairs (not elevators) if evacuating</li>
              <li className="flex items-start gap-2">✔️ Keep emergency kit accessible</li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
            <h4 className="font-bold text-red-700 dark:text-red-300 mb-2">DON'T:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">❌ Go outside during eye of storm</li>
              <li className="flex items-start gap-2">❌ Touch loose electrical wires</li>
              <li className="flex items-start gap-2">❌ Drive through flooded areas</li>
              <li className="flex items-start gap-2">❌ Spread rumors - follow official sources</li>
            </ul>
          </div>
        </div>
        
        <div className="divider my-4" />
        
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <a 
            href="tel:1078" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
          >
            📞 NDMA Helpline: 1078
          </a>
          <a 
            href="https://mausam.imd.gov.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 border border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium py-2 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
          >
            🌐 Track Cyclones
          </a>
        </div>
        
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          Track cyclones on mausam.imd.gov.in or via IMD mobile app
        </div>
      </div>
    </div>
  );
}