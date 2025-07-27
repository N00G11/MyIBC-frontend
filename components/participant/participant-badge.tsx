"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, QrCode } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../request/reques";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

type Inscription = {
  id: number;
  date: string;
  nom: string;
  prenom: string;
  sexe: string;
  telephone: string;
  dateNaissance: string | number;
  pays: string;
  ville: string;
  delegation: string;
  badge: boolean;
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
  const code = useSearchParams().get("id");
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (code) {
      fetchInscription();
    } else {
      setError("Id manquant dans l'URL.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const fetchInscription = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get<Inscription>(`/inscription/code/${code}`);
      setInscription(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
    }
  };

  const handleDownload = async () => {
    if (!badgeRef.current) return;
    
    // Configuration optimisée pour le téléchargement
    const canvas = await html2canvas(badgeRef.current, {
      backgroundColor: '#ffffff',
      scale: 3, // Haute résolution
      useCORS: true,
      allowTaint: true,
      width: 340, // Largeur fixe
      height: 500, // Hauteur fixe
      scrollX: 0,
      scrollY: 0,
    });
    
    const url = canvas.toDataURL("image/png", 1.0);
    const a = document.createElement("a");
    a.href = url;
    a.download = `badge-${inscription?.nom.toLowerCase() || "participant"}-${inscription?.prenom.toLowerCase() || ""}.png`;
    a.click();
  };

  const handlePrint = async () => {
    if (!badgeRef.current) return;
    
    // Configuration optimisée pour l'impression
    const canvas = await html2canvas(badgeRef.current, {
      backgroundColor: '#ffffff',
      scale: 4, // Très haute résolution pour impression
      useCORS: true,
      allowTaint: true,
      width: 340,
      height: 500,
      scrollX: 0,
      scrollY: 0,
    });
    
    const dataUrl = canvas.toDataURL("image/png", 1.0);

    const printWindow = window.open("", "_blank")!;
    printWindow.document.write(`
      <html>
        <head>
          <title>Badge - ${inscription?.nom} ${inscription?.prenom}</title>
          <style>
            @media print {
              body { 
                margin: 0; 
                padding: 20px; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                background: white !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              img { 
                max-width: 340px !important;
                max-height: 500px !important;
                width: 340px !important;
                height: auto !important;
                page-break-inside: avoid;
              }
            }
            body { 
              margin: 0; 
              padding: 20px; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              background: #f8fafc; 
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Badge participant" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => printWindow.close(), 1000);
    };
  };

  if (error) {
    return <div className="p-4 text-red-600 font-semibold">{error}</div>;
  }

  if (!inscription) {
    return <div className="p-4 text-gray-600">Chargement du badge...</div>;
  }

  // Affichage conditionnel du badge
  if (!inscription.badge) {
    return (
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#001F5B]">
            <QrCode className="h-6 w-6" />
            Mon badge participant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-lg text-[#001F5B] font-semibold">
            Le badge n'est pas encore disponible pour ce participant.
          </div>
        </CardContent>
      </Card>
    );
  }

  const badgeId = "#" + String(inscription.id).padStart(6, "0");
  const fullName = `${inscription.nom} ${inscription.prenom}`;
  const birthDate = inscription.dateNaissance
    ? new Date(inscription.dateNaissance).toLocaleDateString("fr-FR")
    : "";

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#001F5B]">
          <QrCode className="h-6 w-6" />
          Mon badge participant
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Badge optimisé pour impression et téléchargement */}
        <div
          ref={badgeRef}
          className="bg-white mx-auto flex flex-col items-center justify-center"
          style={{
            width: '340px',
            height: '500px',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            boxSizing: 'border-box',
            padding: 0,
            margin: 0,
          }}
        >
          {/* Arrière-plan avec dégradé */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #001F5B 0%, #003875 50%, #001F5B 100%)',
              zIndex: 0,
            }}
          />

          {/* Motif décoratif */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at 20% 80%, #D4AF37 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, #D4AF37 0%, transparent 50%),
                          radial-gradient(circle at 40% 40%, #ffffff 0%, transparent 30%)`,
              zIndex: 1,
            }}
          />

          {/* Contenu du badge */}
          <div
            className="relative z-10 h-full w-full flex flex-col justify-between"
            style={{
              padding: '24px 18px 18px 18px',
              boxSizing: 'border-box',
              height: '500px',
              width: '340px',
            }}
          >
            {/* En-tête */}
            <div className="flex justify-between items-center mb-2" style={{ minHeight: 64 }}>
              <div
                className="flex items-center justify-center shadow-lg"
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(145deg, #D4AF37, #B8941F)',
                  borderRadius: '50%',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="text-white font-black text-lg tracking-wider">CMCI</span>
              </div>
              <div className="text-right" style={{ minWidth: 60 }}>
                <div className="text-white font-bold text-2xl tracking-wider">2025</div>
                <div className="text-white/80 text-xs font-medium">EDITION</div>
              </div>
            </div>

            {/* Zone principale */}
            <div
              className="flex-1 mx-0 rounded-xl px-3 py-4 flex flex-col justify-center items-center"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 31, 91, 0.15)',
                width: '100%',
                minHeight: '260px',
              }}
            >
              {/* Informations participant */}
              <div className="text-center mb-2 w-full">
                <h1
                  className="font-black text-[#001F5B] mb-1 tracking-tight leading-tight"
                  style={{ fontSize: '20px', lineHeight: '1.1', wordBreak: 'break-word' }}
                >
                  {fullName.toUpperCase()}
                </h1>

                <div className="space-y-1 mb-2">
                  <div className="text-[#001F5B] font-semibold text-sm">{inscription.telephone}</div>
                  <div className="text-gray-600 text-xs font-medium">
                    {inscription.delegation} • {inscription.ville}
                  </div>
                  <div className="text-gray-600 text-xs font-medium">{inscription.pays}</div>
                </div>

                {/* Tags d'information */}
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}
                  >
                    {inscription.sexe.toUpperCase()}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #001F5B, #003875)' }}
                  >
                    {birthDate}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
                      color: 'white',
                    }}
                  >
                    {inscription.camp.type.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* QR Code centré */}
              <div className="flex flex-col items-center justify-center w-full">
                <div
                  className="p-3 rounded-xl mb-1"
                  style={{
                    background: 'white',
                    border: '2px solid #001F5B',
                    boxShadow: '0 4px 15px rgba(0, 31, 91, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <QRCode
                    value={JSON.stringify({
                      id: inscription.id,
                      nom: inscription.nom,
                      prenom: inscription.prenom,
                      telephone: inscription.telephone,
                      camp: inscription.camp.type,
                      verification: badgeId,
                    })}
                    size={90}
                    bgColor="#ffffff"
                    fgColor="#001F5B"
                    level="M"
                  />
                </div>
                <div
                  className="font-mono font-bold tracking-wider"
                  style={{
                    color: '#001F5B',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    marginTop: '2px',
                  }}
                >
                  {badgeId}
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div className="mt-2 text-center w-full">
              <div className="text-white/90 text-xs font-medium">
                BADGE OFFICIEL • CONGRÈS MONDIAL 2025
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-2 w-full flex flex-col items-center">
            <Button
              variant="outline"
              className="w-5/6 flex items-center justify-center gap-2 h-10 text-[#001F5B] border-[#001F5B] hover:bg-[#001F5B] hover:text-white transition-colors"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
              Télécharger en .png
            </Button>
            <Button
              variant="outline"
              className="w-5/6 flex items-center justify-center gap-2 h-10 text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors"
              onClick={handlePrint}
            >
              <Printer className="h-5 w-5" />
              Imprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}