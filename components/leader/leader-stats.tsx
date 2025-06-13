"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Euro } from "lucide-react";
import axiosInstance from "../request/reques";
import { useSearchParams } from "next/navigation";

interface Camp {
  id: number;
  type: string;
}

export function LeaderStats() {
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [campTypes, setCampTypes] = useState<Camp[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) return;
    fetchStats(email);
  }, [email]);

  const fetchStats = async (email: string) => {
    try {
      // Récupérer le nombre total de participants assignés au dirigeant
      const res1 = await axiosInstance.get(`/statistique/dirigeant/allParticipants/${email}`);
      if (Array.isArray(res1.data)) {
        setParticipantCount(res1.data.length);
      } else {
        setParticipantCount(0);
      }

      // Récupérer la liste des camps
      const res2 = await axiosInstance.get<Camp[]>(`/statistique/dirigeant/allCamp`);
      const camps = res2.data || [];
      setCampTypes(camps);

      // Calculer le montant total à partir de chaque camp
      let total = 0;
      for (const camp of camps) {
        const resAmount = await axiosInstance.get<number>(`/statistique/dirigeant/totalAmountByCamp/${email}/${camp.id}`);
        const amount = Number(resAmount.data);
        if (!isNaN(amount)) {
          total += amount;
        }
      }
      setTotalAmount(total);
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques :", err);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Carte des participants */}
      <Card className="border-l-4 border-l-[#D4AF37]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Mes participants
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{participantCount}</div>
        </CardContent>
      </Card>

      {/* Carte des types de camps */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Types de camps
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campTypes.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {campTypes.map((camp) => camp.type).join(", ")}
          </p>
        </CardContent>
      </Card>

      {/* Carte du montant total */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Montant total
          </CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalAmount.toLocaleString()} FCFA
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            À titre informatif
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
