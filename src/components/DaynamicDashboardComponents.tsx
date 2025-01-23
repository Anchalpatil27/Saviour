'use client'

import dynamic from 'next/dynamic'

export const DynamicMobileHeader = dynamic(() => import("@/components/MobileHeader").then(mod => mod.MobileHeader), { ssr: false })

