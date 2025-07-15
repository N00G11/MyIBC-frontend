"use client"

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileSpreadsheet,
  Users,
} from "lucide-react";
import { AddLeaderDialog } from "./add-leader-dialog";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../request/reques";

// Types des données utilisées
interface Dirigeant {
  id: number;
  username: string;
  pays?: string | null;
  ville?: string | null;
  telephone?: string | null;
}

interface Camp {
  id: number;
  type: string;
  participants?: number;
  devise?: string;
}

type MontantsByCamp = {
  [campId: number]: number;
};

export function LeaderActions() {
  const email = useSearchParams().get("email");

  const [dirigeant, setDirigeant] = useState<Dirigeant | null>(null);
  const [participantsCount, setParticipantsCount] = useState<number | null>(null);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [montantsByCamp, setMontantsByCamp] = useState<MontantsByCamp>({});
  const [totalMontant, setTotalMontant] = useState<number>(0);
  const [totalTransport, setTotalTransport] = useState<number>(0);

  useEffect(() => {
    if (!email) return;

    async function fetchData() {
      try {
        // Récupérer les infos du dirigeant
        const resDirigeant = await axiosInstance.get<Dirigeant>(`/statistique/dirigeant/email/${email}`);
        setDirigeant(resDirigeant.data);

        // Récupérer le nombre total de participants
        const resParticipants = await axiosInstance.get<number>(`/statistique/dirigeant/allParticipantsCount/${email}`);
        setParticipantsCount(resParticipants.data);

        // Récupérer tous les camps
        const resCamps = await axiosInstance.get<Camp[]>(`/statistique/dirigeant/allCamp`);
        setCamps(resCamps.data);

      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    }

    fetchData();
  }, [email]);

  useEffect(() => {
    if (!email || camps.length === 0) return;

    async function fetchMontants() {
      try {
        const results = await Promise.all(
          camps.map((camp) =>
            axiosInstance
              .get<number>(`/statistique/dirigeant/totalAmountByCamp/${email}/${camp.id}`)
              .then((res) => ({ campId: camp.id, montant: res.data }))
              .catch(() => ({ campId: camp.id, montant: 0 }))
          )
        );

        const montants: MontantsByCamp = {};
        let total = 0;
        results.forEach(({ campId, montant }) => {
          montants[campId] = montant;
          total += montant;
        });

        setMontantsByCamp(montants);
        setTotalMontant(total);
      } catch (error) {
        console.error("Erreur lors du chargement des montants :", error);
      }
    }

    fetchMontants();
  }, [email, camps]);

  useEffect(() => {
    if (!email) return;

    async function fetchTransport() {
      try {
        const res = await axiosInstance.get<number>(`/statistique/dirigeant/totalAmountforTransport/${email}`);
        setTotalTransport(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement du total transport :", error);
      }
    }

    fetchTransport();
  }, [email]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AddLeaderDialog />
          <Button className="w-full flex items-center justify-start gap-2" variant="outline">
            <Download className="h-4 w-4" />
            Exporter ma liste
            <FileSpreadsheet className="h-4 w-4 ml-auto" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations du dirigeant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dirigeant ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-500">Nom</label>
                <p className="text-base font-semibold">{dirigeant.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Pays</label>
                <p className="text-base">{dirigeant.pays || "Non défini"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ville</label>
                <p className="text-base">{dirigeant.ville || "Non défini"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                <p className="text-base">{dirigeant.telephone || "Non défini"}</p>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    Responsable de{" "}
                    {participantsCount !== null ? participantsCount : "chargement..."}{" "}
                    participants
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p>Chargement des informations du dirigeant...</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résumé financier</CardTitle>
        </CardHeader>
        <CardContent>
          {camps.length > 0 ? (
            <div className="space-y-3">
              {camps.map((camp) => (
                <div key={camp.id} className="flex justify-between">
                  <span className="text-sm">
                    {camp.type} ({camp.participants || 0})
                  </span>
                  <span className="font-semibold">
                    {montantsByCamp[camp.id]
                      ? `${montantsByCamp[camp.id].toLocaleString("fr-FR")} FCFA`
                      : "0 FCFA"}
                  </span>
                </div>
              ))}

              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Transport</span>
                  <span>{`${totalTransport.toLocaleString("fr-FR")} FCFA`}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-[#001F5B]">
                  <span>Total</span>
                  <span>
                    {`${(totalMontant + totalTransport).toLocaleString("fr-FR")} FCFA`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  À titre informatif
                </p>
              </div>
            </div>
          ) : (
            <p>Chargement des camps...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
