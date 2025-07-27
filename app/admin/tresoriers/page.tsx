"use client"

import { useRef } from "react";
import { TresoriersList } from "@/components/admin/tresoriers/tresoriers-list";
import { TresorierForm } from "@/components/admin/tresoriers/tresorier-form";

export default function TresoriersPage() {
  const listRef = useRef<{ refresh: () => void }>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">
        Gestion des trésoriers
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TresoriersList ref={listRef} />
        </div>
        <div>
          <TresorierForm onAdded={() => listRef.current?.refresh()} />
        </div>
      </div>
    </div>
  );
}