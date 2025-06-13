"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, QrCode } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../request/reques";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas"; // à installer: npm install html2canvas

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
      `<html><head><title>Impression du badge</title></head><body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#f3f4f6;"><img src="${dataUrl}" style="max-width:90vw;max-height:90vh;"/></body></html>`
    );
    printWindow.document.close();
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => printWindow.close(), 1000);
    };
  };

  // Formatage des infos
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
            className="w-72 h-auto bg-white border-2 border-[#001F5B] rounded-xl shadow-xl p-4 flex flex-col"
            ref={badgeRef}
            style={{
              fontFamily: "Inter, sans-serif",
              minHeight: 420,
              background:
                "linear-gradient(160deg, #fff 80%, #e6e7ee 100%)",
            }}
          >
            {/* Header avec logo CMCI */}
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-[#001F5B] rounded-full flex items-center justify-center">
                <span className="text-[#D4AF37] text-base font-extrabold tracking-tight">
                  CMCI
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#001F5B] font-bold">2025</p>
              </div>
            </div>

            {/* Photo placeholder */}
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-[#001F5B]">
              <span className="text-gray-500 text-sm">Photo</span>
            </div>

            {/* Informations */}
            <div className="text-center mb-3">
              <h3 className="text-lg font-extrabold text-[#001F5B] mb-1">
                {p ? p.username : "Participant"}
              </h3>
              <p className="text-xs text-gray-700 mb-1">
                {p?.email}
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 mb-2">
                <span>{p?.sexe?.toUpperCase()}</span>
                <span>
                  {p?.dateNaissance
                    ? new Date(p.dateNaissance).toLocaleDateString()
                    : ""}
                </span>
                <span>{p?.pays}</span>
                <span>{p?.ville}</span>
                <span>{p?.delegation}</span>
                <span>{p?.telephone}</span>
              </div>
              <div className="mb-2">
                <span className="bg-[#D4AF37] text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {inscription?.camp?.type?.toUpperCase() || "CAMP"}
                </span>
              </div>
              <div>
                <span className="bg-[#001F5B] text-white px-2 py-1 rounded-full text-xs font-semibold">
                  PARTICIPANT
                </span>
              </div>
            </div>

            {/* QR Code & ID */}
            <div className="mt-auto flex flex-col items-center">
              <QRCode
                value={JSON.stringify({
                  id: inscription?.id,
                  username: p?.username,
                  email: p?.email,
                  camp: inscription?.camp?.type,
                })}
                size={56}
                bgColor="#ffffff"
                fgColor="#001F5B"
               // includeMargin={false}
              />
              <p className="text-xs text-center text-gray-500 mt-1 font-mono">
                {badgeId}
              </p>
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
            <strong>Important :</strong> Présentez ce badge lors de votre arrivée au camp. Il contient toutes vos
            informations d'identification.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}