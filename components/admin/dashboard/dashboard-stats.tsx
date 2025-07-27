"use client"

import { useEffect, useState } from "react";
import axiosInstance from "@/components/request/reques";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Calendar, DollarSign, Bus } from "lucide-react";

export function DashboardStats() {
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [totalPays, setPays] = useState<number>(0);
  const [campTypes, setCampTypes] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res1 = await axiosInstance.get<number>("/statistique/admin/NumberallInscripion");
      setParticipantCount(res1.data);

      const res2 = await axiosInstance.get<number>("/statistique/admin/allCamp");
      setCampTypes(res2.data);

      const res3 = await axiosInstance.get<number>("/statistique/admin/totalAmount");
      setTotalAmount(res3.data);

      const res4 = await axiosInstance.get<number>("/statistique/admin/NumberAllPays");
      setPays(res4.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques :", err);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {/* Total des participants */}
      <Card className="border-l-4 border-l-[#D4AF37] shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total des participants
          </CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#001F5B]">
            {participantCount}
          </div>
        </CardContent>
      </Card>

      {/* Pays représentés */}
      <Card className="border-l-4 border-l-blue-500 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pays représentés
          </CardTitle>
          <MapPin className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#001F5B]">
            {totalPays}
          </div>
        </CardContent>
      </Card>

      {/* Camps actifs */}
      <Card className="border-l-4 border-l-green-500 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Camps actifs
          </CardTitle>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#001F5B]">
            {campTypes}
          </div>
        </CardContent>
      </Card>

      {/* Montant total */}
      <Card className="border-l-4 border-l-purple-500 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Montant total
          </CardTitle>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#001F5B]">
            {totalAmount.toLocaleString("fr-FR")} FCFA
          </div>
        </CardContent>
      </Card>
    </div>

  );
}
