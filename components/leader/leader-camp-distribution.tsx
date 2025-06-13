"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import axiosInstance from "../request/reques";
import { useSearchParams } from "next/navigation";

interface Camp {
  id: number;
  type: string;
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

  const email = useSearchParams().get("email"); // ou passe-le en props

  useEffect(() => {
    const fetchCampStats = async () => {
      if (!email) return;

      try {
        const campsRes = await axiosInstance.get("/statistique/dirigeant/allCamp");
        const camps: Camp[] = campsRes.data;

        let totalP = 0;
        let totalA = 0;

        const stats = await Promise.all(
          camps.map(async (camp, index) => {
            const [participantsRes, amountRes] = await Promise.all([
              axiosInstance.get(`/statistique/dirigeant/numberParticipantsByCamp/${email}/${camp.id}`),
              axiosInstance.get(`/statistique/dirigeant/totalAmountByCamp/${email}/${camp.id}`),
            ]);

            const participants = participantsRes.data;
            const amount = amountRes.data;

            totalP += participants;
            totalA += amount;

            return {
              id: camp.id,
              name: camp.type,
              participants,
              amount,
              color: colors[index % colors.length],
            };
          })
        );

        setCampData(stats);
        setTotalParticipants(totalP);
        setTotalAmount(totalA);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques de camp :", error);
      }
    };

    fetchCampStats();
  }, [email]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition de mes participants par camp</CardTitle>
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
                      {camp.amount} FCFA
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
          <div className="grid grid-cols-2 gap-4 text-center">
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
                {totalAmount} FCFA
              </div>
              <div className="text-sm text-muted-foreground">Montant total</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
