"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../request/reques";

// Types des données utilisées
interface Utilisateur {
  id: number;
  username: string;
  email?: string | null;
  code?: string | null;
}

export function LeaderActions() {
  const router = useRouter();
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCode = localStorage.getItem("code");
      if (storedCode) setCode(storedCode);
    }
  }, []);

  useEffect(() => {
    if (!code) return;

    const fetchUtilisateur = async () => {
      try {
        const res = await axiosInstance.get<Utilisateur>(
          `/statistique/utilisateur/code/${code}`
        );
        setUtilisateur(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur :", error);
      }
    };

    fetchUtilisateur();
  }, [code]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={() => router.push(`/inscription/camp?id=${code}`)}
          >
            Effectuer une inscription
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {utilisateur ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-500">Nom d'utilisateur</label>
                <p className="text-base font-semibold">{utilisateur.username}</p>
              </div>
              {utilisateur.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-base">{utilisateur.email}</p>
                </div>
              )}
              <div className="flex flex-col items-center mt-6">
                <label className="text-base font-semibold text-blue-700 mb-2">
                  Votre code personnel
                </label>
                <p className="text-3xl font-extrabold text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg px-6 py-4 inline-block tracking-widest shadow-lg border-4 border-blue-300">
                  {utilisateur.code || "Non défini"}
                </p>
                <span className="mt-3 text-sm text-blue-800 bg-blue-100 px-3 py-1 rounded shadow">
                  Ce code vous servira pour vous connecter à l'application. Gardez-le précieusement !
                </span>
              </div>
            </>
          ) : (
            <p>Chargement des informations de l'utilisateur...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
