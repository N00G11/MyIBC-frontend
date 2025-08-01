import { ParticipantForm } from "@/components/admin/participants/participant-form"
import { CmciLogo } from "@/components/cmci-logo"
import { Suspense } from "react"
import Image from "next/image";


export default function Incription() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md px-4 py-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-6">
           <Image
             src="/CMCI.png"
             alt="CMCI Logo"
             width={120}
             height={120}
             className="object-contain"
             priority
           />
          </div>
        </div>
        <Suspense fallback={<div>Chargement...</div>}>
            <ParticipantForm/>
        </Suspense>
      </div>
    </div>
  )
}