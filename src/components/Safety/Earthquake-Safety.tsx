import React from 'react';

const safetyRules = [
  "Drop, Cover, and Hold On: Get down to your hands and knees, cover your head and neck, and hold on to something sturdy.",
  "Stay indoors until the shaking stops. Move away from windows, glass, and heavy objects.",
  "If outside, move to an open area away from buildings, trees, and power lines.",
  "If driving, stop safely and stay inside the vehicle until the shaking stops.",
  "After the shaking, check yourself and others for injuries and provide first aid if needed.",
  "Be prepared for aftershocks and avoid using elevators.",
  "Listen to official information and follow instructions from authorities.",
  "Do not use matches, lighters, or electrical switches if you suspect a gas leak.",
  "Keep emergency supplies ready: water, food, torch, batteries, first aid kit, and important documents.",
  "Help children, elderly, and differently-abled persons to safety first."
];

export default function EarthquakeSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all animate-fade-in" onClick={onClose} aria-modal="true" role="dialog">
      <div className="relative bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-gray-200 dark:border-gray-700 glassmorphic max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-3xl font-bold focus:outline-none transition" onClick={onClose} aria-label="Close">×</button>
        
        <div className="flex items-center gap-3 mb-4">
          <span role="img" aria-label="earthquake" className="text-4xl">🌍</span>
          <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-300">Earthquake Safety Guide (India)</h2>
        </div>
        
        <div className="mb-4 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/40 flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="font-medium text-orange-700 dark:text-orange-300">Earthquakes can strike without warning - be prepared!</span>
        </div>
        
        <div className="divider my-4" />
        
        <h3 className="font-semibold text-lg mb-2 text-orange-600 dark:text-orange-300">Quick Safety Rules:</h3>
        <ul className="grid grid-cols-1 gap-2 mb-4">
          {safetyRules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg px-3 py-2">
              <span className="text-xl">✔️</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        
        <div className="divider my-4" />
        
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-300">Watch: Earthquake Safety Protocol</h3>
          <video width="100%" height="200" controls className="rounded-lg shadow mb-4">
            <source src="/safety-videos/earthquake_safety.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-1">
          <span className="text-xl">⬇️</span>
          <span>Video is always available offline</span>
        </div>
        
        <div className="divider my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
            <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">Emergency Contacts:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">📞 NDMA: 1078</li>
              <li className="flex items-start gap-2">🚑 Ambulance: 108</li>
              <li className="flex items-start gap-2">🚒 Fire: 101</li>
              <li className="flex items-start gap-2">👮 Police: 100</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
            <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">Essential Kit Items:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">💧 3L water per person/day</li>
              <li className="flex items-start gap-2">🔦 Torch + extra batteries</li>
              <li className="flex items-start gap-2">🩹 First aid kit</li>
              <li className="flex items-start gap-2">📄 Important documents</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          For real-time alerts, download the Sagar Vani or NDMA app
        </div>
      </div>
    </div>
  );
}