'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Navigation, Users, Database, ChevronDown } from 'lucide-react'

const features = [
  {
    title: "Real-Time Alerts",
    description: "Receive instant notifications about emergencies and critical updates in your area. Our advanced AI-powered system ensures you're always informed and prepared.",
    icon: AlertTriangle,
  },
  {
    title: "Navigation Assistance",
    description: "Get guided routes to the nearest safe zones and emergency services. Our real-time traffic integration helps you avoid danger and reach safety quickly.",
    icon: Navigation,
  },
  {
    title: "Community Support",
    description: "Connect with local volunteers and organizations to give or receive help. Our platform facilitates seamless communication and resource sharing during crises.",
    icon: Users,
  },
  {
    title: "Resource Management",
    description: "Track and manage essential supplies and resources during crisis situations. Our intelligent inventory system helps optimize distribution and prevent shortages.",
    icon: Database,
  },
]

const FeatureCard = ({ title, description, icon: Icon }: typeof features[0]) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold ml-4 text-gray-800">{title}</h3>
          </div>
          <motion.button
            className="focus:outline-none text-blue-600"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse feature description" : "Expand feature description"}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isExpanded ? 'transform rotate-180' : ''
              }`}
            />
          </motion.button>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function FeatureSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

