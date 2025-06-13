"use client"

import { useEffect, useState } from "react";
import axiosInstance from "@/components/request/reques";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Calendar, DollarSign } from "lucide-react";

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
      // Nombre total d'inscriptions
      const res1 = await axiosInstance.get<number>("/statistique/admin/NumberallInscripion");
      setParticipantCount(res1.data);

      // Liste des camps
      const res2 = await axiosInstance.get<number>("/statistique/admin/allCamp");
      setCampTypes(res2.data);

      // Montant total
      const res3 = await axiosInstance.get<number>("/statistique/admin/totalAmount");
      setTotalAmount(res3.data);

      // Nombre total de pays distincts
      const res4 = await axiosInstance.get<number>("/statistique/admin/NumberAllPays");
      setPays(res4.data);

    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques :", err);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-[#D4AF37] shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total des participants</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{participantCount}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pays représentés</CardTitle>
          <MapPin className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPays}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Camps actifs</CardTitle>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campTypes}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Montant total</CardTitle>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAmount.toLocaleString()} FCFA</div>
        </CardContent>
      </Card>
    </div>
  );
}
