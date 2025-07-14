"use client";

import { DollarSign } from "lucide-react";
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

  const router = useRouter()

   useEffect(() => {
    fetchCamps();
  }, [])

   const fetchCamps = async () => {
    try {
      setError(null)
      const response = await axiosInstance.get("/camp/all")
      const campData = await response.data
      const camps: campType[] = Array.isArray(campData) ? campData : campData.jobs || []
      setCampTypes(camps)
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campTypes.map((camp) => (
        <Card
          key={camp.id}
          className="ibc-card cursor-pointer hover:shadow-xl transition-shadow duration-200"
          onClick={() => router.push(`/inscription?id=${camp.id}&email=${email}`)}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Badge className={`bg-ibc-navy font-semibold`}>
                  {camp.type}
                </Badge>
                <span className="text-sm text-gray-500">
                  {camp.trancheAge} ans
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {camp.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center  p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-ibc-gold mx-auto mb-1" />
                  <div className="text-lg   font-bold text-ibc-navy">
                    {camp.prix} €
                  </div>
                  <div className="text-xs text-gray-500">Tarif</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
