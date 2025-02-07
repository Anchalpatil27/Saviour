import { Suspense } from "react"
import HeroSection from "@/components/HeroSection"
import FeatureSection from "@/components/FeatureSection"
import DonationSection from "@/components/DonationSection"
import ContactSection from "@/components/ContactSection"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import CommunityChat from "@/components/CommunityChat"

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<LoadingSpinner />}>
        <FeatureSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <DonationSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <ContactSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <CommunityChat />
      </Suspense>
    </main>
  )
}

