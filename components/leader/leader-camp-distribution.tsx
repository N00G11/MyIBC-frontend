"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../request/reques";

interface Camp {
  id: number;
  type: string;
  prix: number;
}

interface UserCampAmounts {
  CampFondationAmount: number;
  campJeuneAmount: number;
  campLeaderAmount: number;
}

interface CampStat {
  id: number;
  name: string;
  participants: number;
  amount: number;
  color: string;
}

const colors = ["#D4AF37", "#4C51BF", "#001F5B", "#38B2AC", "#ED8936"];

export function LeaderCampDistribution() {
  const [campData, setCampData] = useState<CampStat[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [code, setCode] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // S'assurer que l'on est côté client avant d'utiliser localStorage
    setIsClient(true);
    const storedCode = typeof window !== "undefined" ? localStorage.getItem("code") : null;
    if (storedCode) {
      setCode(storedCode);
    }
  }, []);

  useEffect(() => {
    const fetchCampStats = async () => {
      if (!code) return;

      try {
        // Récupérer les camps avec leurs prix
        const campsRes = await axiosInstance.get("/camp/all");
        const camps: Camp[] = campsRes.data;

        // Récupérer les montants de l'utilisateur par camp
        const userAmountsRes = await axiosInstance.get(`/statistique/utilisateur/code/${code}`);
        const userAmounts: UserCampAmounts = userAmountsRes.data;

        // Mapping des types de camps aux montants
        const campAmountMapping: { [key: string]: number } = {
          "Camp de la Fondation": userAmounts.CampFondationAmount,
          "Camp des Jeunes": userAmounts.campJeuneAmount,
          "Camp des Leaders": userAmounts.campLeaderAmount,
        };

        let totalP = 0;
        let totalA = 0;

        const stats: CampStat[] = camps.map((camp, index) => {
          const amount = campAmountMapping[camp.type] || 0;
          const participants = camp.prix > 0 ? Math.floor(amount / camp.prix) : 0;

          totalP += participants;
          totalA += amount;

          return {
            id: camp.id,
            name: camp.type,
            participants,
            amount,
            color: colors[index % colors.length],
          };
        });

        setCampData(stats);
        setTotalParticipants(totalP);
        setTotalAmount(totalA);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques de camp :", error);
      }
    };

    fetchCampStats();
  }, [code]);

  if (!code) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement...</CardTitle>
          <CardDescription>Connexion au profil utilisateur</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition de mes payements</CardTitle>
        <CardDescription>
          Distribution et montants par type de camp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {campData.map((camp) => {
            const percentage = totalParticipants
              ? Math.round((camp.participants / totalParticipants) * 100)
              : 0;

            return (
              <div key={camp.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: camp.color }}
                    />
                    <span className="font-medium">{camp.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {camp.participants} participants
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {camp.amount.toLocaleString("fr-FR")} FCFA
                    </div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{percentage}% du total</span>
                  <span>
                    {camp.participants}/{totalParticipants}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 justify-center items-center text-center">
            <div>
              <div className="text-2xl font-bold text-[#001F5B]">
                {totalParticipants}
              </div>
              <div className="text-sm text-muted-foreground">
                Total participants
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#D4AF37]">
                {totalAmount.toLocaleString("fr-FR")} FCFA
              </div>
              <div className="text-sm text-muted-foreground">
                Montant total
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
