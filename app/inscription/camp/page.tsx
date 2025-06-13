import { Suspense } from "react";
import { CmciLogo } from "@/components/cmci-logo";
import { CampSelect } from "@/components/camp-select";

export default function Camp() {
  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full px-20 py-24">
        <div className="flex justify-center mb-8">
          <CmciLogo className="h-24 w-auto" />
        </div>
        <Suspense fallback={<div>Chargement...</div>}>
          <CampSelect />
        </Suspense>
      </div>
    </div>
  );
}
