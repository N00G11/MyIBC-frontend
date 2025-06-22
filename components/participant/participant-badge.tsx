"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, QrCode } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../request/reques";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas"; // npm install html2canvas

type Inscription = {
  id: number;
  date: string;
  participant: {
    username: string;
    email: string;
    telephone: string;
    sexe: string;
    dateNaissance: string | number;
    pays: string;
    ville: string;
    delegation: string;
  };
  camp: {
    type: string;
  };
  dirigeantAssigne: {
    username: string;
  };
};

export function ParticipantBadge() {
  const [inscription, setInscription] = useState<Inscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const email = useSearchParams().get("email");
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInscription();
    // eslint-disable-next-line
  }, []);

  const fetchInscription = async () => {
    try {
      setError(null);
      if (!email) {
        setError("Email manquant dans l'URL.");
        return;
      }
      const response = await axiosInstance.get<Inscription>(`/inscription/email/${email}`);
      setInscription(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err);
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    }
  };

  const handleDownload = async () => {
    if (!badgeRef.current) return;
    const canvas = await html2canvas(badgeRef.current, { backgroundColor: null });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `badge-${inscription?.participant.username || "participant"}.png`;
    a.click();
  };

  const handlePrint = async () => {
    if (!badgeRef.current) return;
    const canvas = await html2canvas(badgeRef.current, { backgroundColor: null });
    const dataUrl = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank")!;
    printWindow.document.write(
      `<html><head><title>Impression du badge</title></head><body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#f3f4f6;"><img src="${dataUrl}" style="max-width:100%;max-height:100%;"/></body></html>`
    );
    printWindow.document.close();
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => printWindow.close(), 1000);
    };
  };

  const p = inscription?.participant;
  const badgeId = inscription ? "#" + String(inscription.id).padStart(6, "0") : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Mon badge
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>
        )}
        <div className="flex justify-center mb-4">
          <div
            ref={badgeRef}
            className="w-[500px] h-[280px] bg-white border-2 border-[#001F5B] rounded-xl shadow-xl flex overflow-hidden"
            style={{
              fontFamily: "Inter, sans-serif",
              background: "linear-gradient(90deg, #fff 70%, #e6e7ee 100%)",
            }}
          >
            {/* Colonne gauche - Infos */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1">
                <div className="w-10 h-10 bg-[#001F5B] rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] text-base font-extrabold">CMCI</span>
                </div>
                <p className="text-sm text-[#001F5B] font-bold">2025</p>
              </div>

              <div className="text-left">
                <h3 className="text-lg font-extrabold text-[#001F5B]">{p?.username || "Participant"}</h3>
                <p className="text-xs text-gray-700">{p?.email}</p>
                <div className="mt-1 space-y-0.5 text-xs text-gray-600">
                  <p><strong>Sexe :</strong> {p?.sexe?.toUpperCase()}</p>
                  <p><strong>Naissance :</strong> {p?.dateNaissance ? new Date(p.dateNaissance).toLocaleDateString() : ""}</p>
                  <p><strong>Pays :</strong> {p?.pays}</p>
                  <p><strong>Ville :</strong> {p?.ville}</p>
                  <p><strong>Délégation :</strong> {p?.delegation}</p>
                  <p><strong>Téléphone :</strong> {p?.telephone}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <span className="bg-[#D4AF37] text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {inscription?.camp?.type?.toUpperCase() || "CAMP"}
                </span>
                <span className="bg-[#001F5B] text-white px-2 py-1 rounded-full text-xs font-semibold">
                  PARTICIPANT
                </span>
              </div>
            </div>

            {/* Colonne droite - QR code */}
            <div className="w-40 p-3 flex flex-col items-center justify-center border-l border-gray-300 bg-[#f9fafb]">
              <QRCode
                value={JSON.stringify({
                  id: inscription?.id,
                  username: p?.username,
                  email: p?.email,
                  camp: inscription?.camp?.type,
                })}
                size={80}
                bgColor="#ffffff"
                fgColor="#001F5B"
              />
              <p className="text-xs text-center text-gray-500 mt-2 font-mono">{badgeId}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger mon badge
          </Button>
          <Button variant="outline" className="w-full" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer mon badge
          </Button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>Important :</strong> Présentez ce badge lors de votre arrivée au camp. Il contient toutes vos informations d'identification.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
