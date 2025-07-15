"use client";

import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "./request/reques";

type campType = {
  id: number;
  type: string;
  description: string;
  trancheAge: string;
  prix: number;
  devise: string;
  participants: number;
};

export function CampSelect() {
  const [campTypes, setCampTypes] = useState<campType[]>([]);
  const email = useSearchParams().get("email");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get("/camp/all");
      const data = await response.data;
      const camps: campType[] = Array.isArray(data) ? data : data.jobs || [];
      setCampTypes(camps);
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err);
      setError("Impossible de charger les camps.");
    }
  };

  return (
    <div className="min-h-screen bg-myibc-light p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {campTypes.map((camp) => (
          <Card
            key={camp.id}
            onClick={() =>
              router.push(`/inscription?id=${camp.id}&email=${email}`)
            }
            className="cursor-pointer transition-shadow duration-200 border border-gray-200 hover:shadow-lg bg-white rounded-lg"
          >
            <CardHeader className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <Badge className="bg-myibc-blue text-white px-3 py-1 text-sm font-semibold">
                  {camp.type}
                </Badge>
                <span className="text-sm text-myibc-graytext">
                  {camp.trancheAge} ans
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <p className="text-sm text-myibc-graytext leading-relaxed">
                {camp.description}
              </p>

              <div className="p-4 bg-myibc-light rounded-md flex flex-col items-center text-center">
                <DollarSign className="h-5 w-5 text-myibc-gold mb-2" />
                <div className="text-xl font-bold text-myibc-blue">
                  {camp.prix} {camp.devise}
                </div>
                <p className="text-xs text-myibc-graytext mt-1">Tarif du camp</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
