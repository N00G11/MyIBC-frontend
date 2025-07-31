"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePaymentRefresh } from "@/hooks/use-payment-refresh";
import axiosInstance from "@/components/request/reques";
import { TrendingUp, Users, RefreshCw } from "lucide-react";

type Camp = {
  id: number;
  type: string;
  trancheAge: string;
  prix: number;
  participants: number;
};

type CampTotal = {
  camp: Camp;
  totalAmount: number;
};

export function CampsTotals() {
  const [campsTotals, setCampsTotals] = useState<CampTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { refreshTrigger } = usePaymentRefresh();

  useEffect(() => {
    fetchCampsTotals();
  }, [refreshTrigger]); // Se recharge quand refreshTrigger change

  const fetchCampsTotals = async () => {
    try {
      setError(null);
      
      // Si les données sont déjà chargées, marquer comme rafraîchissement
      if (campsTotals.length > 0) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      // Récupérer tous les camps
      const campsResponse = await axiosInstance.get("/camp/all");
      const camps: Camp[] = Array.isArray(campsResponse.data) ? campsResponse.data : [];

      // Récupérer le montant total pour chaque camp
      const campsTotalsPromises = camps.map(async (camp) => {
        try {
          // Essayer d'abord l'endpoint admin
          let totalResponse;
          try {
            totalResponse = await axiosInstance.get(`/statistique/admin/totalAmountByCamp/${camp.id}`);
          } catch (adminError) {
            // Si l'endpoint admin ne fonctionne pas, essayer une approche alternative
            // En récupérant tous les paiements et en filtrant par camp
            try {
              const paymentsResponse = await axiosInstance.get("/payement/all");
              const payments = paymentsResponse.data?.payements || paymentsResponse.data || [];
              
              // Filtrer les paiements pour ce camp et calculer le total
              const campPayments = payments.filter((payment: any) => 
                payment.camp && payment.camp.type === camp.type
              );
              const total = campPayments.reduce((sum: number, payment: any) => 
                sum + (payment.montant || 0), 0
              );
              
              return {
                camp,
                totalAmount: total,
              };
            } catch (fallbackError) {
              console.warn(`Impossible de récupérer les totaux pour le camp ${camp.type}:`, fallbackError);
              return {
                camp,
                totalAmount: 0,
              };
            }
          }
          
          return {
            camp,
            totalAmount: totalResponse.data || 0,
          };
        } catch {
          return {
            camp,
            totalAmount: 0,
          };
        }
      });

      const results = await Promise.all(campsTotalsPromises);
      setCampsTotals(results);
    } catch (err) {
      setError("Erreur lors du chargement des totaux par camp");
      console.error("Erreur détaillée:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  if (loading) return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
          Récapitulatif des montants collectés par camp
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50">
              <div className="animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="border-t pt-4">
                  <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
  
  if (error) return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
          Montants totaux par camp
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">{error}</div>
          <button 
            onClick={fetchCampsTotals}
            className="text-sm text-blue-600 hover:underline"
          >
            Réessayer
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
          Montants totaux par camp
          {isRefreshing && (
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600 ml-2" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Totaux par camp */}
          {campsTotals.map(({ camp, totalAmount }) => (
            <div
              key={camp.id}
              className={`p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50 ${
                isRefreshing ? 'opacity-75' : ''
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-[#001F5B] border-[#001F5B] font-semibold">
                    {camp.type}
                  </Badge>
                  <span className="text-sm text-gray-500 font-medium">
                    {camp.trancheAge} ans
                  </span>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">XAF</span>
                    <span>{camp.prix} FCFA/personne</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#001F5B] mb-1">
                      {totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">FCFA collectés</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {campsTotals.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <span className="text-4xl font-bold text-gray-300 block mb-3">XAF</span>
              <p className="text-lg font-medium">Aucun camp trouvé</p>
              <p className="text-sm">Les données des camps seront affichées ici</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
