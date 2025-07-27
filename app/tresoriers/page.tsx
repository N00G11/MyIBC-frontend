"use client";

import { PayementForm } from "@/components/payements/payement-form";
import { PayementsList } from "@/components/payements/payements-list";
import { CampsTotals } from "@/components/payements/camps-totals";
import { PaymentProvider } from "@/hooks/use-payment-refresh";

export default function TresorierPayementsPage() {
  return (
    <PaymentProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#001F5B] mb-2">
              Gestion des paiements
            </h1>
            <p className="text-gray-600">
              Interface de gestion des paiements pour les trésoriers
            </p>
          </div>
          
          {/* Layout principal */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Liste des paiements - 2/3 de l'espace */}
            <div className="lg:col-span-2 space-y-6">
              <PayementsList />
            </div>
            
            {/* Formulaire de paiement - 1/3 de l'espace */}
            <div className="lg:col-span-1">
              <PayementForm />
            </div>
          </div>
          
          {/* Totaux par camp - largeur complète */}
          <div className="mt-8">
            <CampsTotals />
          </div>
        </div>
      </div>
    </PaymentProvider>
  );
}