import React from 'react';

const coldSafetyRules = [
  { icon: "🧥", text: "Layer clothing: Cotton (inner), Wool (middle), Windproof (outer) - especially in hill stations" },
  { icon: "🏠", text: "Maintain room temperature at 18-20°C to prevent hypothermia (use safe heating methods)" },
  { icon: "❄️", text: "Watch for frostbite signs: White/waxy skin, numbness on fingers/toes/nose/ears" },
  { icon: "🥜", text: "Eat warm, high-calorie foods (nuts, ghee, dried fruits) and drink warm fluids frequently" },
  { icon: "🚗", text: "Winterize vehicles: Check antifreeze, keep fuel tank half-full, carry emergency kit" },
  { icon: "🚰", text: "Prevent frozen pipes: Let faucets drip slightly during extreme cold in North India" },
  { icon: "🚑", text: "Recognize hypothermia: Shivering, slurred speech, drowsiness (urgent warming needed)" }
];

const vulnerableGroups = [
  "Elderly (especially with poor circulation)",
  "Homeless/street dwellers",
  "Infants (lose heat quickly)",
  "Outdoor workers",
  "People with chronic illnesses",
  "High-altitude travelers",
  "Mountain villagers"
];

const winterKitItems = [
  "Thermal blankets",
  "Hand/foot warmers",
  "Portable heater (safe type)",
  "Insulated water bottle",
  "High-energy snacks",
  "Extra medicines",
  "Battery-powered radio",
  "Rock salt for icy walkways"
];

export default function ExtremeColdSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-200 dark:border-blue-700">
        <button 
          className="absolute top-4 right-4 text-blue-600 dark:text-blue-200 hover:text-red-500 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">❄️</span>
          <div>
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100">Extreme Cold Safety (India)</h2>
            <p className="text-blue-600 dark:text-blue-300 text-sm">
              IMD Coldwave: ≤10°C Plains / ≤0°C Hills / 4.5°C below normal
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Protection Strategies */}
          <section>
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-200 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 dark:bg-blue-700 p-2 rounded-full">🛡️</span>
              Protection Strategies
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coldSafetyRules.map((rule, idx) => (
                <li key={idx} className="bg-white/80 dark:bg-blue-800/80 p-3 rounded-lg shadow-sm flex items-start gap-3">
                  <span className="text-2xl">{rule.icon}</span>
                  <span className="text-blue-900 dark:text-blue-100">{rule.text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* High-Risk Groups & Winter Kit */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50/80 dark:bg-red-900/50 p-4 rounded-xl">
              <h4 className="font-bold text-red-700 dark:text-red-200 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                High-Risk Groups
              </h4>
              <ul className="space-y-2">
                {vulnerableGroups.map((group, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-red-800 dark:text-red-100">
                    <span>•</span>
                    <span>{group}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50/80 dark:bg-green-900/50 p-4 rounded-xl">
              <h4 className="font-bold text-green-700 dark:text-green-200 mb-3 flex items-center gap-2">
                <span className="text-xl">🧳</span>
                Winter Kit Essentials
              </h4>
              <ul className="space-y-2">
                {winterKitItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-green-800 dark:text-green-100">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Hypothermia First Aid */}
          <section className="bg-purple-50/80 dark:bg-purple-900/50 p-4 rounded-xl">
            <h4 className="font-bold text-purple-700 dark:text-purple-200 mb-3 flex items-center gap-2">
              <span className="text-xl">🚑</span>
              Hypothermia First Aid
            </h4>
            <ol className="space-y-2 pl-5 list-decimal text-purple-800 dark:text-purple-100">
              <li>Move to warm place (avoid direct heat source)</li>
              <li>Remove wet clothing, wrap in dry blankets</li>
              <li>Give warm, sweet drinks (no alcohol)</li>
              <li>Seek medical help immediately</li>
            </ol>
          </section>

          {/* Special Note */}
          <div className="bg-yellow-50/80 dark:bg-yellow-900/50 p-4 rounded-xl flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <p className="text-yellow-800 dark:text-yellow-100">
              For traditional homes in Kashmir/Ladakh: Use kangri (fire pot) safely with proper ventilation to prevent carbon monoxide poisoning
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href="tel:108" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
            >
              📞 Cold Helpline: 108
            </a>
            <a 
              href="https://mausam.imd.gov.in/coldwave/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 border-2 border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
            >
              🌐 IMD Coldwave Alerts
            </a>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-blue-600 dark:text-blue-300">
            Check on elderly neighbors daily during cold waves - especially in North Indian cities
          </p>
        </div>
      </div>
    </div>
  );
}