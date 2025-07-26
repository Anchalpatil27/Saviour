import React from 'react';

const landslideSafetyRules = [
  { icon: "🏠", text: "Watch for warning signs: New cracks in walls/roads, tilting trees, sudden water flow changes" },
  { icon: "📅", text: "Be extra alert during monsoon (June-Sept) and after earthquakes in hilly areas" },
  { icon: "🪧", text: "Know evacuation routes to stable ground (usually perpendicular to landslide path)" },
  { icon: "👂", text: "Listen for unusual sounds like trees cracking or boulders knocking during heavy rain" },
  { icon: "🛋️", text: "If indoors during landslide: Stay inside, take cover under sturdy furniture" },
  { icon: "🏃", text: "If outdoors: Move quickly to nearest high ground away from slide path" },
  { icon: "🚗", text: "If driving: Watch for collapsed pavement, mud, fallen rocks - abandon vehicle if needed" }
];

const vulnerableAreas = [
  "Houses near steep slopes",
  "Areas where landslides occurred before",
  "Valleys near mountain slopes",
  "Road cuts in hilly terrain",
  "River banks and erosion areas"
];

const preparednessItems = [
  "Emergency contact list (local authorities)",
  "Battery-powered radio",
  "First aid kit + essential medicines",
  "Sturdy shoes + gloves",
  "Whistle for signaling",
  "Important documents (waterproof bag)",
  "Cash (ATMs may be inaccessible)",
  "Water (3L per person per day)",
  "Non-perishable food (3-day supply)"
];

const preventiveMeasures = [
  "Plant deep-rooted vegetation on slopes",
  "Install proper drainage to reduce water flow",
  "Build retaining walls for unstable slopes",
  "Avoid construction on steep slopes (≥15°)",
  "Monitor slope movement with sensors"
];

export default function LandslideSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-200 dark:border-amber-700">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⛰️</span>
            <div>
              <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-100">Landslide Safety (India)</h2>
              <p className="text-amber-600 dark:text-amber-300 text-sm">
                High-risk zones: Himalayas, Western Ghats, Northeast India
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-amber-600 dark:text-amber-300 hover:text-red-500 text-3xl font-bold transition"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 mb-4 flex items-start gap-2">
          <span className="text-xl">⚠️</span>
          <p className="font-medium text-red-700 dark:text-red-200">
            Immediate evacuation recommended if you hear unusual rumbling sounds or see ground movement
          </p>
        </div>

        {/* Safety Rules */}
        <section className="mb-6">
          <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-100 mb-3 flex items-center gap-2">
            <span className="bg-amber-100 dark:bg-amber-700 p-2 rounded-full">🆘</span>
            Immediate Response Guide
          </h3>
          <ul className="grid grid-cols-1 gap-3">
            {landslideSafetyRules.map((rule, idx) => (
              <li key={idx} className="bg-white/80 dark:bg-amber-800/80 p-3 rounded-lg shadow-sm flex items-start gap-3">
                <span className="text-2xl">{rule.icon}</span>
                <span className="text-amber-900 dark:text-amber-100">{rule.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Vulnerable Areas & Preparedness */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50/80 dark:bg-red-900/30 p-4 rounded-xl">
            <h4 className="font-bold text-red-700 dark:text-red-200 mb-3 flex items-center gap-2">
              <span className="text-xl">📍</span>
              High-Risk Areas
            </h4>
            <ul className="space-y-2">
              {vulnerableAreas.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2 text-red-800 dark:text-red-100">
                  <span>•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50/80 dark:bg-green-900/30 p-4 rounded-xl">
            <h4 className="font-bold text-green-700 dark:text-green-200 mb-3 flex items-center gap-2">
              <span className="text-xl">🧰</span>
              Preparedness Kit
            </h4>
            <ul className="space-y-2">
              {preparednessItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-green-800 dark:text-green-100">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Preventive Measures */}
        <section className="bg-blue-50/80 dark:bg-blue-900/30 rounded-xl p-4 mb-6">
          <h4 className="font-bold text-blue-700 dark:text-blue-200 mb-3 flex items-center gap-2">
            <span className="text-xl">🌱</span>
            Long-Term Preventive Measures
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {preventiveMeasures.map((measure, idx) => (
              <li key={idx} className="flex items-start gap-2 text-blue-800 dark:text-blue-100">
                <span>•</span>
                <span>{measure}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Emergency Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <a 
            href="tel:108" 
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
          >
            📞 Emergency: 108
          </a>
          <a 
            href="https://ndma.gov.in/Natural-Hazards/Landslides" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 border-2 border-amber-600 text-amber-600 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
          >
            🌐 NDMA Guidelines
          </a>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-amber-600 dark:text-amber-300">
          Monitor rainfall patterns and soil movement in your area during monsoon season
        </div>
      </div>
    </div>
  );
}