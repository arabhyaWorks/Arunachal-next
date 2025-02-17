"use client"

import { Suspense } from "react"

export default function SuspenseWrapper({ children, fallback = "Loading..." }) {
  return <Suspense fallback={<div className="suspense-fallback">{fallback}</div>}>{children}</Suspense>
}