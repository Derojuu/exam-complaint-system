"use client"

import { useState } from "react"
import { HomePageNavigation } from "@/components/home/HomePageNavigation"
import { HeroSection } from "@/components/home/HeroSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { ProcessSection } from "@/components/home/ProcessSection"
import { CTASection } from "@/components/home/CTASection"
import { HomePageFooter } from "@/components/home/HomePageFooter"

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <HomePageNavigation navOpen={navOpen} setNavOpen={setNavOpen} />
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <CTASection />
      <HomePageFooter />
    </div>
  )
}
