"use client";
import { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/components/request/reques";

type Versement = {
  id: number;
  montant: number;
  date: string;
  campType: string;
  utilisateurUsername: string;
  tresorierNom: string;
};

export default function PayementsPage() {
  const [versements, setVersements] = useState<Versement[]>([]);

  useEffect(() => {
    axiosInstance.get("/payement/all").then(res => {
      // Adaptation selon la structure de l'API
      const data = (res.data.payements || []).map((p: any) => ({
        id: p.id,
        montant: p.montant,
        date: p.date,
        campType: p.camp?.type || "",
        utilisateurUsername: p.utilisateur?.username || "",
        tresorierNom: p.tresoriers?.username || "",
      }));
      setVersements(data);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#001F5B]">Tous les versements</h1>
      <Card>
        <CardHeader>
          <CardTitle>Liste des versements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type de camp</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Trésorier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versements.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.montant} €</TableCell>
                    <TableCell>{new Date(v.date).toLocaleDateString()}</TableCell>
                    <TableCell>{v.campType}</TableCell>
                    <TableCell>{v.utilisateurUsername}</TableCell>
                    <TableCell>{v.tresorierNom}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}