import React from 'react';

const firstAidSteps = [
  "Check the scene for safety before approaching the injured person.",
  "Call for emergency medical help if needed.",
  "If the person is unconscious, check for breathing and pulse.",
  "If not breathing, begin CPR if you are trained.",
  "Stop any bleeding by applying firm pressure with a clean cloth.",
  "Keep the injured person warm and comfortable.",
  "Do not move the person unless absolutely necessary.",
  "Reassure the injured person and stay with them until help arrives.",
  "If you suspect a fracture, immobilize the limb.",
  "Always wash your hands before and after giving first aid."
];

const emergencyContacts = [
  { name: "National Emergency", number: "112" },
  { name: "Ambulance", number: "108" },
  { name: "Police", number: "100" },
  { name: "Disaster Management", number: "1078" }
];

const firstAidKitItems = [
  "Sterile gauze pads",
  "Adhesive bandages",
  "Antiseptic wipes",
  "Medical tape",
  "Scissors",
  "Tweezers",
  "Disposable gloves",
  "Thermometer",
  "Pain relievers",
  "Emergency blanket"
];

export default function FirstAidTutorial({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-red-50 to-white dark:from-red-900 dark:to-gray-800 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-red-200 dark:border-red-700">
        <button 
          className="absolute top-4 right-4 text-red-600 dark:text-red-200 hover:text-gray-700 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🩹</span>
          <div>
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-100">First Aid Tutorial (India)</h2>
            <p className="text-red-600 dark:text-red-300 text-sm">
              Essential life-saving procedures everyone should know
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* First Aid Steps */}
          <section>
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-200 mb-3 flex items-center gap-2">
              <span className="bg-red-100 dark:bg-red-700 p-2 rounded-full">🆘</span>
              Essential First Aid Steps
            </h3>
            <ul className="grid grid-cols-1 gap-3">
              {firstAidSteps.map((step, idx) => (
                <li key={idx} className="bg-white/80 dark:bg-red-800/80 p-3 rounded-lg shadow-sm flex items-start gap-3">
                  <span className="text-2xl text-red-500 dark:text-red-300">🩺</span>
                  <span className="text-gray-800 dark:text-gray-100">{step}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Video Tutorial */}
          <section>
          <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-300">Watch:  First-Aid Tutorial</h3>
          <video width="100%" height="200" controls className="rounded-lg shadow mb-4">
            <source src="/safety-videos/firstaid_tutorial.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
              </section>
          {/* Emergency Contacts & First Aid Kit */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50/80 dark:bg-blue-900/50 p-4 rounded-xl">
              <h4 className="font-bold text-blue-700 dark:text-blue-200 mb-3 flex items-center gap-2">
                <span className="text-xl">📞</span>
                Emergency Contacts
              </h4>
              <ul className="space-y-2">
                {emergencyContacts.map((contact, idx) => (
                  <li key={idx} className="flex justify-between items-center text-blue-800 dark:text-blue-100">
                    <span>{contact.name}</span>
                    <a 
                      href={`tel:${contact.number}`} 
                      className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition"
                    >
                      {contact.number}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50/80 dark:bg-green-900/50 p-4 rounded-xl">
              <h4 className="font-bold text-green-700 dark:text-green-200 mb-3 flex items-center gap-2">
                <span className="text-xl">🧰</span>
                First Aid Kit Essentials
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                {firstAidKitItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-green-800 dark:text-green-100">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CPR Quick Guide */}
          <section className="bg-purple-50/80 dark:bg-purple-900/50 p-4 rounded-xl">
            <h4 className="font-bold text-purple-700 dark:text-purple-200 mb-3 flex items-center gap-2">
              <span className="text-xl">💓</span>
              CPR Quick Guide (Adults)
            </h4>
            <ol className="space-y-2 pl-5 list-decimal text-purple-800 dark:text-purple-100">
              <li>Place heel of hand on center of chest</li>
              <li>Interlock fingers, keep arms straight</li>
              <li>Push hard and fast (100-120 compressions/minute)</li>
              <li>Give 2 rescue breaths after every 30 compressions</li>
              <li>Continue until help arrives or person revives</li>
            </ol>
          </section>

          {/* Footer Note */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Consider taking a certified first aid course from Indian Red Cross or St. John Ambulance
          </div>
        </div>
      </div>
    </div>
  );
}