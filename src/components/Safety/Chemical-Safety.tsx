import React from 'react';

const chemicalSafetyRules = [
  "Always read Safety Data Sheets (SDS) before handling any chemical",
  "Use proper personal protective equipment (PPE): gloves, goggles, lab coat",
  "Never mix chemicals unless you know the potential reactions",
  "Work in well-ventilated areas or use fume hoods",
  "Label all containers clearly with contents and hazards",
  "Store chemicals properly: flammable in fire cabinets, acids separately from bases",
  "Know emergency procedures for spills/exposure for each chemical",
  "Never smell or taste chemicals - use proper ventilation instead",
  "Wash hands thoroughly after handling any chemicals",
  "Dispose of chemical waste according to local regulations",
  "Keep emergency showers and eyewash stations accessible",
  "Understand GHS hazard pictograms and warning labels",
  "Store chemicals at appropriate temperatures and away from incompatible materials",
  "Transport chemicals in secondary containment",
  "Have spill kits appropriate for the chemicals you're using",
  "Know first aid measures for chemical exposure (eyes, skin, inhalation)"
];

const ghsPictograms = [
  { icon: "⚠️", label: "Flammable" },
  { icon: "☠️", label: "Toxic" },
  { icon: "🧪", label: "Corrosive" },
  { icon: "🔥", label: "Oxidizer" }
];

const ppeList = [
  { icon: "🦺", text: "Safety goggles" },
  { icon: "🧤", text: "Chemical-resistant gloves" },
  { icon: "🥼", text: "Lab coat/apron" },
  { icon: "😷", text: "Respirator (if needed)" }
];

export default function ChemicalSafety({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all animate-fade-in" onClick={onClose} aria-modal="true" role="dialog">
      <div className="relative bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-gray-200 dark:border-gray-700 glassmorphic max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-3xl font-bold focus:outline-none transition" onClick={onClose} aria-label="Close">×</button>
        <div className="flex items-center gap-3 mb-4">
          <span role="img" aria-label="skull" className="text-4xl">☠️</span>
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Chemical Safety Guide</h2>
        </div>
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/40 flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="font-medium text-red-700 dark:text-red-300">Chemical exposure can cause immediate and long-term health effects!</span>
        </div>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-300">Essential Chemical Safety Rules:</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {chemicalSafetyRules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg px-3 py-2">
              <span className="text-xl">🧪</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-300">GHS Hazard Pictograms:</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {ghsPictograms.map((pic, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg px-3 py-2">
              <span className="text-2xl">{pic.icon}</span>
              <span>{pic.label}</span>
            </div>
          ))}
        </div>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-300">Watch: Chemical Safety Protocol</h3>
          <video width="100%" height="200" controls className="rounded-lg shadow mb-4">
            <source src="/safety-videos/chemical_safety.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        <div className="modal-section mb-4 flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
          <span className="text-xl">📞</span>
          <span className="font-medium">Poison Control (India): 1800-116-117</span>
        </div>
        <div className="divider my-4" />
        <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-300">Basic PPE for Chemical Handling:</h3>
        <ul className="grid grid-cols-2 gap-2 mb-2">
          {ppeList.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg px-3 py-2">
              <span className="text-xl">{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}