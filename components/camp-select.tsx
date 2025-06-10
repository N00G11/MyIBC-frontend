"use client";

import { DollarSign, Edit, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CampType {
  id: string;
  nom: string;
  description: string;
  montant: number;
  ageMin: number;
  ageMax: number;
  participants: number;
  couleur: string;
}

export function CampSelect() {
  const [campTypes, setCampTypes] = useState<CampType[]>([
    {
      id: "1",
      nom: "Agneaux",
      description: "Camp pour les jeunes enfants de 6 à 12 ans",
      montant: 150,
      ageMin: 6,
      ageMax: 12,
      participants: 89,
      couleur: "bg-green-100 text-green-800",
    },
    {
      id: "2",
      nom: "Jeunes",
      description: "Camp pour les adolescents et jeunes adultes de 13 à 30 ans",
      montant: 300,
      ageMin: 13,
      ageMax: 30,
      participants: 102,
      couleur: "bg-blue-100 text-blue-800",
    },
    {
      id: "3",
      nom: "Leaders",
      description: "Camp de formation pour les responsables et dirigeants",
      montant: 450,
      ageMin: 25,
      ageMax: 65,
      participants: 54,
      couleur: "bg-purple-100 text-purple-800",
    },
  ]);

  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campTypes.map((camp) => (
        <Card
          key={camp.id}
          className="ibc-card cursor-pointer hover:shadow-xl transition-shadow duration-200"
          onClick={() => router.push("/inscription")}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Badge className={`${camp.couleur} font-semibold`}>
                  {camp.nom}
                </Badge>
                <span className="text-sm text-gray-500">
                  {camp.ageMin}-{camp.ageMax} ans
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
                    {camp.montant} €
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
