import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export function LeaderContact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          Mon dirigeant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Photo et nom du dirigeant */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#001F5B] rounded-full flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#001F5B]">Jean Dupont</h3>
              <p className="text-sm text-gray-600">Dirigeant principal</p>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#D4AF37]" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">jean.dupont@cmci.org</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#D4AF37]" />
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#D4AF37]" />
              <div>
                <p className="text-sm font-medium">Centre</p>
                <p className="text-sm text-gray-600">Centre Évangélique</p>
                <p className="text-xs text-gray-500">Paris, France</p>
              </div>
            </div>
          </div>

          {/* Bouton de contact */}
          <Button className="w-full bg-[#D4AF37] hover:bg-[#c09c31] text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contacter mon dirigeant
          </Button>

          {/* Co-dirigeant */}
          <div className="pt-3 border-t">
            <p className="text-sm font-medium text-gray-500 mb-2">Co-dirigeant</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Marie Lambert</p>
                <p className="text-xs text-gray-500">marie.lambert@cmci.org</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
