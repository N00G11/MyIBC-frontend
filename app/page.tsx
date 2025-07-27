import HomePage from "@/components/home-page"
import { Suspense } from "react"

export default function Home() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <HomePage />
    </Suspense>
  )
}
