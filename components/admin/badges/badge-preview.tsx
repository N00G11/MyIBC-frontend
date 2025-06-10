"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BadgePreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperçu du badge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="w-80 h-96 bg-white border-2 border-[#001F5B] rounded-lg shadow-lg p-6 flex flex-col">
            {/* Header avec logo CMCI */}
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#001F5B] rounded-full flex items-center justify-center">
                <span className="text-[#D4AF37] text-xs font-bold">CMCI</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#001F5B] font-semibold">2025</p>
                <p className="text-xs text-gray-600">Camp Biblique</p>
              </div>
            </div>

            {/* Photo placeholder */}
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-500 text-xs">Photo</span>
            </div>

            {/* Informations du participant */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-[#001F5B] mb-1">Pierre Dubois</h3>
              <p className="text-sm text-gray-600 mb-2">Camp des Jeunes</p>
              <div className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                PARTICIPANT
              </div>
            </div>

            {/* QR Code */}
            <div className="mt-auto">
              <div className="w-16 h-16 bg-gray-900 mx-auto mb-2 flex items-center justify-center">
                <div className="w-12 h-12 bg-white flex items-center justify-center">
                  <div
                    className="w-8 h-8 bg-black"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='30' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='50' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='70' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='10' y='30' width='10' height='10' fill='%23fff'/%3E%3Crect x='50' y='30' width='10' height='10' fill='%23fff'/%3E%3Crect x='70' y='30' width='10' height='10' fill='%23fff'/%3E%3Crect x='10' y='50' width='10' height='10' fill='%23fff'/%3E%3Crect x='30' y='50' width='10' height='10' fill='%23fff'/%3E%3Crect x='70' y='50' width='10' height='10' fill='%23fff'/%3E%3Crect x='10' y='70' width='10' height='10' fill='%23fff'/%3E%3Crect x='30' y='70' width='10' height='10' fill='%23fff'/%3E%3Crect x='50' y='70' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E")`,
                      backgroundSize: "cover",
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-center text-gray-500">ID: #2025001</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-semibold text-[#001F5B] mb-2">Caractéristiques du badge :</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Nom complet du participant</li>
            <li>• Type de camp assigné</li>
            <li>• QR Code unique pour identification</li>
            <li>• Logo CMCI intégré</li>
            <li>• Format standard pour impression</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
