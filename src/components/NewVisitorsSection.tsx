import { FeatureShowcase } from './FeatureShowcase'
import { PlatformInfo } from './PlatformInfo'
import { TeamInfo } from './TeamInfo'
import { ContactInfo } from './ContactInfo'

export function NewVisitorsSection() {
  return (
    <section className="w-full max-w-5xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to SAVIOUR</h1>
      <FeatureShowcase />
      <PlatformInfo />
      <TeamInfo />
      <ContactInfo />
    </section>
  )
}

