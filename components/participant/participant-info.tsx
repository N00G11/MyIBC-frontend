import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react"

export function ParticipantInfo() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Mes informations personnelles
        </CardTitle>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nom complet</label>
              <p className="text-lg font-semibold text-[#001F5B]">Pierre Dubois</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Genre</label>
              <p className="text-base">Masculin</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Date de naissance</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-base">15 mars 2008 (15 ans)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-base">pierre.dubois@email.com</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Téléphone</label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-base">+33 6 12 34 56 78</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Localisation</label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <p className="text-base">Paris, France</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-500">Statut d'inscription</label>
              <div className="mt-1">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ Inscrit et confirmé</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Délégation</label>
              <p className="text-base font-medium">Île-de-France</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
