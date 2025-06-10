import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer, QrCode } from "lucide-react"

export function ParticipantBadge() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Mon badge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <div className="w-48 h-60 bg-white border-2 border-[#001F5B] rounded-lg shadow-lg p-4 flex flex-col">
            {/* Header avec logo CMCI */}
            <div className="flex justify-between items-start mb-3">
              <div className="w-8 h-8 bg-[#001F5B] rounded-full flex items-center justify-center">
                <span className="text-[#D4AF37] text-xs font-bold">CMCI</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#001F5B] font-semibold">2025</p>
              </div>
            </div>

            {/* Photo placeholder */}
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-gray-500 text-xs">Photo</span>
            </div>

            {/* Informations */}
            <div className="text-center mb-3">
              <h3 className="text-sm font-bold text-[#001F5B] mb-1">Pierre Dubois</h3>
              <p className="text-xs text-gray-600 mb-2">Camp des Jeunes</p>
              <div className="bg-[#D4AF37] text-white px-2 py-1 rounded-full text-xs font-semibold">PARTICIPANT</div>
            </div>

            {/* QR Code */}
            <div className="mt-auto">
              <div className="w-12 h-12 bg-gray-900 mx-auto mb-1 flex items-center justify-center">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <div className="w-6 h-6 bg-black opacity-80" />
                </div>
              </div>
              <p className="text-xs text-center text-gray-500">#2025001</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Télécharger mon badge
          </Button>
          <Button variant="outline" className="w-full">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer mon badge
          </Button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>Important :</strong> Présentez ce badge lors de votre arrivée au camp. Il contient toutes vos
            informations d'identification.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
