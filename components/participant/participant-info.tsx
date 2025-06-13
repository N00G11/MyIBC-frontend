"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import axiosInstance from "../request/reques"
import { useSearchParams } from "next/navigation"

type Inscription = {
  id: number
  date: string
  participant: {
    username: string
    email: string
    telephone: string
    sexe: string
    dateNaissance: string | number
    pays: string
    ville: string
    delegation: string
  }
  camp: {
    type: string
  }
  dirigeantAssigne: {
    username: string
  }
}

export function ParticipantInfo() {
  const [inscription, setInscription] = useState<Inscription | null>(null)
  const [error, setError] = useState<string | null>(null)
  const email = useSearchParams().get("email")

  useEffect(() => {
    fetchInscription()
  }, [])

  const fetchInscription = async () => {
    try {
      setError(null)
      const response = await axiosInstance.get<Inscription>(`/inscription/email/${email}`)
      setInscription(response.data)
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  const formatDate = (date: string | number) => {
    const d = new Date(date)
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (error) {
    return <div className="text-red-600">Erreur : {error}</div>
  }

  if (!inscription) {
    return <div>Chargement des données...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Mes informations personnelles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nom complet</label>
              <p className="text-lg font-semibold text-[#001F5B]">{inscription.participant.username}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Genre</label>
              <p className="text-base">{inscription.participant.sexe}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Date de naissance</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-base">{formatDate(inscription.participant.dateNaissance)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-base">{inscription.participant.email}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Téléphone</label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-base">{inscription.participant.telephone}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Localisation</label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <p className="text-base">
                  {inscription.participant.ville}, {inscription.participant.pays}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-500">Statut d'inscription</label>
              <div className="mt-1">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  ✓ Inscrit et confirmé
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Délégation</label>
              <p className="text-base font-medium">{inscription.participant.delegation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
