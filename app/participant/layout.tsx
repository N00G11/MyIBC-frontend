import type React from "react"
import { ParticipantHeader } from "@/components/participant/participant-header"

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ParticipantHeader />
      <main className="container mx-auto px-4 py-6 max-w-4xl">{children}</main>
    </div>
  )
}
