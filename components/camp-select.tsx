"use client";

import { DollarSign, Users, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "./request/reques";

type campType = {
  id: number
  type: string
  description: string
  trancheAge: string
  prix: number
  devise: string
  participants: number
}

export function CampSelect() {
  const [campTypes, setCampTypes] = useState<campType[]>([])
  const email = useSearchParams().get("email")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    fetchCamps();
  }, [])

  const fetchCamps = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await axiosInstance.get("/camp/all")
      const campData = await response.data
      const camps: campType[] = Array.isArray(campData) ? campData : campData.jobs || []
      setCampTypes(camps)
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchCamps}
                className="px-4 py-2 bg-ibc-navy text-white rounded-lg hover:bg-ibc-navy/90 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-ibc-navy">
          Choisissez votre camp
        </h2>
        <p className="text-gray-600">
          Sélectionnez le camp qui correspond le mieux à vos besoins
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campTypes.map((camp) => (
          <Card
            key={camp.id}
            className="group relative overflow-hidden bg-white border-2 border-gray-100 hover:border-ibc-gold/30 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => router.push(`/inscription?id=${camp.id}&email=${email}`)}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-ibc-navy/5 to-ibc-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader className="relative">
              <div className="flex justify-between items-start mb-3">
                <Badge className="bg-ibc-navy hover:bg-ibc-navy text-white font-semibold px-3 py-1 text-sm shadow-sm">
                  {camp.type}
                </Badge>
                <div className="flex items-center gap-1 text-ibc-gold">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {camp.trancheAge} ans
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-ibc-navy group-hover:text-ibc-gold transition-colors duration-200">
                  Camp {camp.type}
                </h3>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {camp.description}
              </p>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center p-4 bg-gradient-to-br from-ibc-navy/5 to-ibc-navy/10 rounded-xl border border-ibc-navy/10 group-hover:border-ibc-gold/20 transition-colors duration-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-ibc-gold/10 rounded-full mb-2 group-hover:bg-ibc-gold/20 transition-colors duration-200">
                    <DollarSign className="h-5 w-5 text-ibc-gold" />
                  </div>
                  <div className="text-xl font-bold text-ibc-navy">
                    {camp.prix}€
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Tarif
                  </div>
                </div>

                <div className="flex flex-col items-center p-4 bg-gradient-to-br from-ibc-gold/5 to-ibc-gold/10 rounded-xl border border-ibc-gold/10 group-hover:border-ibc-navy/20 transition-colors duration-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-ibc-navy/10 rounded-full mb-2 group-hover:bg-ibc-navy/20 transition-colors duration-200">
                    <Users className="h-5 w-5 text-ibc-navy" />
                  </div>
                  <div className="text-xl font-bold text-ibc-navy">
                    {camp.participants}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Places
                  </div>
                </div>
              </div>

              {/* Action Indicator */}
              <div className="flex items-center justify-center pt-2">
                <div className="px-4 py-2 bg-ibc-navy text-white text-sm font-medium rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                  Sélectionner ce camp
                </div>
              </div>
            </CardContent>

            {/* Hover effect border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-ibc-gold/20 rounded-lg transition-colors duration-300"></div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {campTypes.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MapPin className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun camp disponible
          </h3>
          <p className="text-gray-600 mb-4">
            Il n'y a actuellement aucun camp disponible.
          </p>
          <button
            onClick={fetchCamps}
            className="px-6 py-2 bg-ibc-navy text-white rounded-lg hover:bg-ibc-navy/90 transition-colors"
          >
            Actualiser
          </button>
        </div>
      )}
    </div>
  );
}