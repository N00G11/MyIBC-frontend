import BadgePage from "@/components/badge-participant";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <BadgePage />
    </Suspense>
  )
}