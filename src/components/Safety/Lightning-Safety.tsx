import React from 'react';

const lightningSafetyRules = [
  { icon: "⚡", text: "30-30 Rule: If thunder follows lightning within 30 seconds, go indoors. Wait 30 minutes after last thunder before going out" },
  { icon: "🏠", text: "Safe shelters: Fully enclosed buildings with wiring/plumbing (not sheds or open structures)" },
  { icon: "🏃", text: "If outdoors: Avoid open fields, hilltops, and isolated trees. Crouch low if caught outside" },
  { icon: "💧", text: "Avoid plumbing and water sources during thunderstorms (lightning can travel through pipes)" },
  { icon: "🔌", text: "Unplug electrical appliances to prevent surge damage (India's voltage fluctuations worsen this)" },
  { icon: "📵", text: "Avoid corded phones and electronic devices connected to power" },
  { icon: "☂️", text: "Never use umbrellas with metal parts during thunderstorms" }
];

const vulnerableActivities = [
  "Farming in open fields",
  "Construction work",
  "Bathing/showering",
  "Swimming/boating",
  "Golfing/cricket",
  "Mountain climbing",
  "Working with electrical equipment"
];

const firstAidSteps = [
  "Call 108 immediately (lightning victims don't carry charge)",
  "Begin CPR if needed (lightning often causes cardiac arrest)",
  "Treat burns with cool water (no ointments)",
  "Check for other injuries (broken bones, hearing damage)",
  "Keep victim warm and calm"
];

const indiaStats = [
  "~2,500 lightning deaths annually (highest globally)",
  "Pre-monsoon (Apr-May) most dangerous in East/Northeast",
  "Post-monsoon (Oct-Nov) risky in South Peninsula",
  "Install lightning arresters in rural homes"
];

export default function LightningSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-200 dark:border-purple-700">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl text-purple-600">⚡</span>
            <div>
              <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-100">Lightning Safety (India)</h2>
              <p className="text-purple-600 dark:text-purple-300 text-sm">
                High-risk states: WB, Odisha, Jharkhand, MP, Maharashtra (Apr-June & Sept-Nov)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-purple-600 dark:text-purple-300 hover:text-red-500 text-3xl font-bold transition"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Emergency Alert */}
        <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 mb-4 flex items-start gap-2">
          <span className="text-xl">⚠️</span>
          <p className="font-medium text-yellow-800 dark:text-yellow-200">
            When thunder roars, go indoors! Lightning can strike 10-15 km from rain area
          </p>
        </div>

        {/* Safety Rules */}
        <section className="mb-6">
          <h3 className="font-semibold text-lg text-purple-800 dark:text-purple-100 mb-3 flex items-center gap-2">
            <span className="bg-purple-100 dark:bg-purple-700 p-2 rounded-full">🛡️</span>
            Lightning Safety Rules
          </h3>
          <ul className="grid grid-cols-1 gap-3">
            {lightningSafetyRules.map((rule, idx) => (
              <li key={idx} className="bg-white/80 dark:bg-purple-800/80 p-3 rounded-lg shadow-sm flex items-start gap-3">
                <span className="text-2xl">{rule.icon}</span>
                <span className="text-purple-900 dark:text-purple-100">{rule.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Risky Activities & First Aid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50/80 dark:bg-red-900/30 p-4 rounded-xl">
            <h4 className="font-bold text-red-700 dark:text-red-200 mb-3 flex items-center gap-2">
              <span className="text-xl">🚫</span>
              High-Risk Activities
            </h4>
            <ul className="space-y-2">
              {vulnerableActivities.map((activity, idx) => (
                <li key={idx} className="flex items-start gap-2 text-red-800 dark:text-red-100">
                  <span>•</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50/80 dark:bg-green-900/30 p-4 rounded-xl">
            <h4 className="font-bold text-green-700 dark:text-green-200 mb-3 flex items-center gap-2">
              <span className="text-xl">🩹</span>
              First Aid Steps
            </h4>
            <ol className="space-y-2 pl-5 list-decimal text-green-800 dark:text-green-100">
              {firstAidSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* India Statistics */}
        <section className="bg-blue-50/80 dark:bg-blue-900/30 rounded-xl p-4 mb-6">
          <h4 className="font-bold text-blue-700 dark:text-blue-200 mb-3 flex items-center gap-2">
            <span className="text-xl">📊</span>
            Lightning in India
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {indiaStats.map((stat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-blue-800 dark:text-blue-100">
                <span>•</span>
                <span>{stat}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Protection Measures */}
        <section className="bg-amber-50/80 dark:bg-amber-900/20 rounded-xl p-3 mb-4">
          <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
            <span className="text-xl">🏡</span>
            Protection Measures
          </h4>
          <ul className="space-y-1 text-amber-800 dark:text-amber-100">
            <li className="flex items-start gap-2">• Install lightning arresters (especially in rural areas)</li>
            <li className="flex items-start gap-2">• Use surge protectors for electronics</li>
            <li className="flex items-start gap-2">• Avoid concrete floors/walls during storms (can conduct electricity)</li>
          </ul>
        </section>

        {/* Emergency Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a 
            href="tel:108" 
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
          >
            📞 Emergency: 108
          </a>
          <a 
            href="https://mausam.imd.gov.in/thunderstorm/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 border-2 border-purple-600 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-medium py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
          >
            🌐 IMD Warnings
          </a>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-purple-600 dark:text-purple-300 mt-4">
          Lightning can strike even when skies appear clear - stay alert during storm seasons
        </div>
      </div>
    </div>
  );
}