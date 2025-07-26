import React from 'react';

const heatSafetyRules = [
  { icon: "🌡️", text: "Stay indoors between 12pm-4pm when temperatures peak (especially May-June)" },
  { icon: "💧", text: "Drink 2-3 liters of water daily (even if not thirsty) - avoid alcohol/caffeine" },
  { icon: "👒", text: "Wear light-colored, loose cotton clothes with wide-brimmed hats outdoors" },
  { icon: "🧊", text: "Use damp cloths on neck/wrists and take cool showers to lower body temperature" },
  { icon: "🏠", text: "Keep living spaces cool: Use curtains, cross-ventilation, and damp sheets" },
  { icon: "🚗", text: "Never leave children/pets in parked vehicles (temperature rises rapidly)" },
  { icon: "🚑", text: "Recognize heatstroke signs: High body temp, confusion, dry skin, rapid pulse" }
];

const vulnerableGroups = [
  "Outdoor workers (construction, farming)",
  "Elderly (65+ years)",
  "Children under 5",
  "Pregnant women",
  "People with chronic illnesses",
  "Street dwellers",
  "Athletes training outdoors"
];

const coolingSolutions = [
  "DIY cooler: Wet towel + fan",
  "Potted plants for shade",
  "Reflective window films",
  "Cooling peppermint spray",
  "Pulpy fruits (watermelon, cucumber)",
  "Cotton curtains soaked in water",
  "Stay on lower floors (heat rises)"
];

export default function ExtremeHeatSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900 dark:to-amber-900 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-200 dark:border-orange-700">
        <button 
          className="absolute top-4 right-4 text-orange-600 dark:text-orange-200 hover:text-red-500 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🔥</span>
          <div>
            <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-100">Extreme Heat Safety (India)</h2>
            <p className="text-orange-600 dark:text-orange-300 text-sm">
              IMD Heatwave: ≥40°C Plains / ≥30°C Hills / 4.5°C above normal
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Survival Strategies */}
          <section>
            <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-200 mb-3 flex items-center gap-2">
              <span className="bg-orange-100 dark:bg-orange-700 p-2 rounded-full">🛡️</span>
              Survival Strategies
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {heatSafetyRules.map((rule, idx) => (
                <li key={idx} className="bg-white/80 dark:bg-orange-800/80 p-3 rounded-lg shadow-sm flex items-start gap-3">
                  <span className="text-2xl">{rule.icon}</span>
                  <span className="text-orange-900 dark:text-orange-100">{rule.text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* High-Risk Groups & Cooling Solutions */}
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

            <div className="bg-blue-50/80 dark:bg-blue-900/50 p-4 rounded-xl">
              <h4 className="font-bold text-blue-700 dark:text-blue-200 mb-3 flex items-center gap-2">
                <span className="text-xl">❄️</span>
                Low-Cost Cooling
              </h4>
              <ul className="space-y-2">
                {coolingSolutions.map((solution, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-blue-800 dark:text-blue-100">
                    <span>•</span>
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Heatstroke First Aid */}
          <section className="bg-purple-50/80 dark:bg-purple-900/50 p-4 rounded-xl">
            <h4 className="font-bold text-purple-700 dark:text-purple-200 mb-3 flex items-center gap-2">
              <span className="text-xl">🚑</span>
              Heatstroke First Aid
            </h4>
            <ol className="space-y-2 pl-5 list-decimal text-purple-800 dark:text-purple-100">
              <li>Move to shade, remove excess clothing</li>
              <li>Cool with wet cloths/ice packs (neck, armpits, groin)</li>
              <li>Hydrate with ORS/lemon water (no alcohol)</li>
              <li>Seek medical help immediately</li>
            </ol>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href="tel:108" 
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
            >
              📞 Heat Helpline: 108
            </a>
            <a 
              href="https://mausam.imd.gov.in/heatwave/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 border-2 border-orange-600 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
            >
              🌐 IMD Heatwave Alerts
            </a>
          </div>

          {/* Footer Note */}
          <div className="bg-yellow-50/80 dark:bg-yellow-900/50 p-3 rounded-lg text-center">
            <p className="text-yellow-800 dark:text-yellow-100">
              Check on neighbors during heatwaves - especially elderly living alone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}