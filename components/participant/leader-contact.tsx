"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axiosInstance from "../request/reques"


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
    email: string
    telephone: string
    delegation: string
    ville: string
    pays: string
  }
}


export function LeaderContact() {

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
              <h3 className="font-semibold text-[#001F5B]">{inscription?.dirigeantAssigne?.username}</h3>
              <p className="text-sm text-gray-600">Dirigeant</p>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#D4AF37]" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">{inscription?.dirigeantAssigne?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#D4AF37]" />
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm text-gray-600">{inscription?.dirigeantAssigne?.telephone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#D4AF37]" />
              <div>
                <p className="text-sm font-medium">Centre</p>
                <p className="text-sm text-gray-600">{inscription?.dirigeantAssigne?.delegation}</p>
                <p className="text-xs text-gray-500">{inscription?.dirigeantAssigne?.ville}, {inscription?.dirigeantAssigne?.pays}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
