"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Euro, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axiosInstance from "../request/reques"

type Inscription = {
  id: number
  date: string
  nom: string
  prenom: string
  sexe: string
  telephone: string
  dateNaissance: string | number
  pays: string
  ville: string
  delegation: string
  camp: {
    type: string
    date: string
    trancheAge: string
    prix: number
    participants: number
  }
  dirigeantAssigne: {
    username: string
  }
}

const campProgrammes: Record<string, string[][]> = {
  "Camp des Agneaux": [
    [
      "• Enseignements bibliques",
      "• Ateliers créatifs",
      "• Sports et jeux"
    ],
    [
      "• Temps de louange",
      "• Activités de groupe",
      "• Soirées spéciales"
    ]
  ],
  "Camp des Jeunes": [
    [
      "• Conférences inspirantes",
      "• Ateliers carrière",
      "• Sports collectifs"
    ],
    [
      "• Louange & worship",
      "• Networking",
      "• Soirées à thème"
    ]
  ],
  "Camp des Leaders": [
    [
      "• Leadership & management",
      "• Coaching personnalisé",
      "• Ateliers de prise de parole"
    ],
    [
      "• Sessions de mentorat",
      "• Networking avancé",
      "• Soirées stratégiques"
    ]
  ]
}

export function CampInfo() {
  const [inscription, setInscription] = useState<Inscription | null>(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const code = searchParams.get("id")

  useEffect(() => {
    if (code) {
      fetchInscription(code)
    } else {
      setError("Aucun identifiant fourni.")
    }
  }, [code])

  const fetchInscription = async (id: string) => {
    try {
      setError(null)
      const response = await axiosInstance.get<Inscription>(`/inscription//code/${id}`)
      setInscription(response.data)
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  const campType = inscription?.camp?.type?.trim() || "Camp des Agneaux"
  const programme = campProgrammes[campType] || campProgrammes["Camp des Agneaux"]

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>
  }

  if (!inscription) {
    return <div>Chargement des données...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Informations sur mon camp
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Type de camp */}
          <div className="flex items-center justify-between p-4 bg-[#001F5B] text-white rounded-lg">
            <div>
              <h3 className="text-lg font-bold">{inscription.camp.type}</h3>
              <p className="text-sm opacity-90">{inscription.camp.trancheAge} ans</p>
            </div>
            <Badge className="bg-[#D4AF37] text-white hover:bg-[#D4AF37]">
              {inscription.camp.type.split(" ").pop()}
            </Badge>
          </div>

          {/* Détails du camp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Dates du camp</p>
                  <p className="text-base font-semibold">{inscription.camp.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Lieu</p>
                  <p className="text-base font-semibold">Centre de Vacances ....</p>
                  <p className="text-sm text-gray-600">
                    {inscription.ville}, {inscription.pays}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Participants inscrits</p>
                  <p className="text-base font-semibold">{inscription.camp.participants} participants</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Euro className="h-4 w-4 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Contribution</p>
                  <p className="text-base font-semibold">{inscription.camp.prix} FCFA</p>
                  <Badge variant="outline" className="text-xs">
                    À titre informatif
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Programme */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-[#001F5B] mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Programme du camp
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                {programme[0].map((item, idx) => (
                  <p className="font-medium" key={idx}>
                    {item}
                  </p>
                ))}
              </div>
              <div>
                {programme[1].map((item, idx) => (
                  <p className="font-medium" key={idx}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
