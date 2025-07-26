import React from 'react';

const tsunamiSafetyRules = [
  { icon: "⚠️", text: "Recognize natural warnings: Strong earthquake, unusual sea level changes, loud ocean roar" },
  { icon: "🏃", text: "Don't wait for official alerts - immediately move inland/to higher ground (at least 15m elevation)" },
  { icon: "🪧", text: "Know your community's evacuation routes and safe zones (marked with blue boards in coastal areas)" },
  { icon: "⏱️", text: "Tsunamis can arrive within minutes (2004 tsunami reached Tamil Nadu in 2 hours)" },
  { icon: "🏢", text: "Move to upper floors of concrete buildings if you can't evacuate inland (vertical evacuation)" },
  { icon: "👀", text: "Never go to the coast to watch - first wave may not be the largest" },
  { icon: "📻", text: "Monitor All India Radio (AIR) 104 FM for official updates after initial evacuation" }
];

const tsunamiKitItems = [
  "Life jackets for each family member",
  "Waterproof document bag (Aadhaar, insurance)",
  "Emergency cash (small denominations)",
  "Portable weather radio",
  "High-energy snacks (3-day supply)",
  "Medicines + first aid kit",
  "Whistle + flashlight",
  "Extra batteries + power bank",
  "Local map with evacuation routes",
  "Water purification tablets"
];

const phaseGuidance = [
  {
    phase: "Before",
    items: [
      "Know evacuation routes and safe zones",
      "Participate in community drills (Nov 5 annually)",
      "Identify concrete buildings for vertical evacuation"
    ]
  },
  {
    phase: "During",
    items: [
      "Move inland immediately (don't wait for warning)",
      "Climb to upper floors if trapped",
      "Avoid rivers/streams leading to coast"
    ]
  },
  {
    phase: "After",
    items: [
      "Wait for official 'all clear' before returning",
      "Avoid floodwaters - may contain hazards",
      "Check for injuries and provide first aid"
    ]
  }
];

export default function TsunamiSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900 dark:to-teal-900 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-200 dark:border-blue-700">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl text-blue-600">🌊</span>
            <div>
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100">Tsunami Safety (India)</h2>
              <p className="text-blue-600 dark:text-blue-300 text-sm">
                High-risk zones: Tamil Nadu, AP, Kerala, Odisha, Andaman & Nicobar
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-blue-600 dark:text-blue-300 hover:text-red-500 text-3xl font-bold transition"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 mb-4 flex items-start gap-2">
          <span className="text-xl">⚠️</span>
          <p className="font-medium text-red-700 dark:text-red-200">
            If you feel a strong earthquake near the coast, don't wait - evacuate immediately!
          </p>
        </div>

        {/* Safety Rules */}
        <section className="mb-6">
          <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-100 mb-3 flex items-center gap-2">
            <span className="bg-blue-100 dark:bg-blue-700 p-2 rounded-full">🆘</span>
            Immediate Response Guide
          </h3>
          <ul className="grid grid-cols-1 gap-3">
            {tsunamiSafetyRules.map((rule, idx) => (
              <li key={idx} className="bg-white/80 dark:bg-blue-800/80 p-3 rounded-lg shadow-sm flex items-start gap-3">
                <span className="text-2xl">{rule.icon}</span>
                <span className="text-blue-900 dark:text-blue-100">{rule.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tsunami Go-Bag */}
        <section className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
            <span className="text-xl">🎒</span>
            Tsunami Emergency Kit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tsunamiKitItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-green-800 dark:text-green-100">
                <span className="text-xl">✔️</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Phase Guidance */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {phaseGuidance.map((phase, idx) => (
            <div key={idx} className={`bg-${idx === 0 ? 'yellow' : idx === 1 ? 'red' : 'purple'}-50/80 dark:bg-${idx === 0 ? 'yellow' : idx === 1 ? 'red' : 'purple'}-900/30 rounded-xl p-3`}>
              <h4 className="font-bold text-${idx === 0 ? 'yellow' : idx === 1 ? 'red' : 'purple'}-700 dark:text-${idx === 0 ? 'yellow' : idx === 1 ? 'red' : 'purple'}-200 mb-2">
                {phase.phase}
              </h4>
              <ul className="space-y-1">
                {phase.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <span>•</span>
                    <span className={`text-${idx === 0 ? 'yellow' : idx === 1 ? 'red' : 'purple'}-800 dark:text-${idx === 0 ? 'yellow' : idx === 1 ? 'red' : 'purple'}-100`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Emergency Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a 
            href="tel:1070" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
          >
            📞 Disaster Helpline: 1070
          </a>
          <a 
            href="https://incois.gov.in/tsunami" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 border-2 border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
          >
            🌐 INCOIS Warnings
          </a>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-blue-600 dark:text-blue-300 mt-4">
          Tsunami waves can continue for hours - stay on high ground until officials declare it safe
        </div>
      </div>
    </div>
  );
}