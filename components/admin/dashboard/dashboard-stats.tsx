"use client"

import { useEffect, useState } from "react";
import axiosInstance from "@/components/request/reques";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Calendar, DollarSign, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface CampStats {
  agneaux: number;
  fondation: number;
  leaders: number;
}

interface CampAmounts {
  agneaux: number;
  fondation: number;
  leaders: number;
}

interface GrowthIndicator {
  value: number;
  percentage: string;
  isPositive: boolean;
}

interface Pays{
  id: number;
  name: string;
}


type Camp = {
  id: number;
  type: string;
  trancheAge: string;
  prix: number;
  participants: number;
};

export function DashboardStats() {
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [paysList, setPaysList] = useState<Pays[]>([]);
  const [campTypes, setCampTypes] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allCamps, setAllCamps] = useState<Camp[]>([]);
  
  // Données détaillées par camp
  const [campStats, setCampStats] = useState<CampStats>({
    agneaux: 0,
    fondation: 0,
    leaders: 0
  });

  const [campAmounts, setCampAmounts] = useState<CampAmounts>({
    agneaux: 0,
    fondation: 0,
    leaders: 0
  });

  // Indicateurs de croissance (simulés pour maintenir le design)
  const [growthIndicators] = useState({
    participants: { value: 12, percentage: "", isPositive: true },
    pays: { value: 3, percentage: "", isPositive: true },
    camps: { value: 2, percentage: "", isPositive: true },
    revenue: { value: 8, percentage: "", isPositive: true }
  });

  // Rafraîchissement au montage du composant
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);
      
      // Si les données sont déjà chargées, marquer comme rafraîchissement
      if (participantCount > 0 || totalAmount > 0) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      // Récupérer toutes les statistiques en parallèle
      const [
        campsRes,
        paysRes,
        campsDataRes
      ] = await Promise.allSettled([
        axiosInstance.get<number>("/statistique/admin/allCamp"),
        axiosInstance.get<Pays[]>("/statistique/admin/NumberAllPays"),
        axiosInstance.get("/camp/all")
      ]);

      // Traiter les résultats
      if (campsRes.status === 'fulfilled') {
        setCampTypes(campsRes.value.data);
      }

      if (paysRes.status === 'fulfilled') {
        const pays = Array.isArray(paysRes.value.data) ? paysRes.value.data : [];
        setPaysList(pays);
      }

      // Récupérer les détails par camp et calculer les totaux
      if (campsDataRes.status === 'fulfilled') {
        const camps: Camp[] = Array.isArray(campsDataRes.value.data) ? campsDataRes.value.data : [];
        setAllCamps(camps);
        
        // Calculer le total des participants à partir des camps
        const totalParticipants = camps.reduce((sum, camp) => sum + (camp.participants || 0), 0);
        setParticipantCount(totalParticipants);
        
        await fetchCampDetails(camps);
      }

    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques :", err);
      setError("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchCampDetails = async (camps: Camp[]) => {
    try {
      // Récupérer les montants par camp
      const campDetails = await Promise.allSettled(
        camps.map(async (camp) => {
          try {
            // Récupérer le montant total pour ce camp
            let totalAmount = 0;
            try {
              const totalResponse = await axiosInstance.get(`/statistique/admin/totalAmountByCamp/${camp.id}`);
              totalAmount = totalResponse.data || 0;
            } catch {
              // Fallback: calculer à partir des paiements
              try {
                const paymentsResponse = await axiosInstance.get("/payement/all");
                const payments = paymentsResponse.data?.payements || paymentsResponse.data || [];
                const campPayments = payments.filter((payment: any) => 
                  payment.camp && payment.camp.type === camp.type
                );
                totalAmount = campPayments.reduce((sum: number, payment: any) => 
                  sum + (payment.montant || 0), 0
                );
              } catch {
                totalAmount = 0;
              }
            }

            return {
              type: camp.type.toLowerCase(),
              participants: camp.participants || 0,
              amount: totalAmount
            };
          } catch {
            return {
              type: camp.type.toLowerCase(),
              participants: camp.participants || 0,
              amount: 0
            };
          }
        })
      );

      // Organiser les données par type de camp
      const newCampStats: CampStats = { agneaux: 0, fondation: 0, leaders: 0 };
      const newCampAmounts: CampAmounts = { agneaux: 0, fondation: 0, leaders: 0 };
      let calculatedTotalAmount = 0;

      campDetails.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { type, participants, amount } = result.value;
          calculatedTotalAmount += amount;
          
          if (type.includes('agneaux')) {
            newCampStats.agneaux = participants;
            newCampAmounts.agneaux = amount;
          } else if (type.includes('fondation')) {
            newCampStats.fondation = participants;
            newCampAmounts.fondation = amount;
          } else if (type.includes('leader')) {
            newCampStats.leaders = participants;
            newCampAmounts.leaders = amount;
          }
        }
      });

      setCampStats(newCampStats);
      setCampAmounts(newCampAmounts);
      setTotalAmount(calculatedTotalAmount);

    } catch (err) {
      console.error("Erreur lors de la récupération des détails par camp:", err);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("fr-FR");
  };

  const GrowthBadge = ({ indicator }: { indicator: GrowthIndicator }) => (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ml-2 ${
      indicator.isPositive 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {indicator.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {indicator.percentage}
    </div>
  );

  // Fonction pour rafraîchir manuellement
  const handleManualRefresh = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-l-4 border-l-gray-300 shadow-lg bg-white">
            <CardHeader className="pb-3">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="col-span-full border-l-4 border-l-red-500 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-2">{error}</div>
              <button 
                onClick={fetchStats}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bouton de rafraîchissement manuel */}
      <div className="flex justify-end">
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {/* Total des participants */}
        <Card className={`border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white ${
          isRefreshing ? 'opacity-75' : ''
        }`}>
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-600">
                Total des participants
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-gray-900">
                {participantCount}
              </div>
              <GrowthBadge indicator={growthIndicators.participants} />
            </div>
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Camp des agneaux:</span>
                <span className="font-medium">{campStats.agneaux}</span>
              </div>
              <div className="flex justify-between">
                <span>Camp de la fondation:</span>
                <span className="font-medium">{campStats.fondation}</span>
              </div>
              <div className="flex justify-between">
                <span>Camp des leaders:</span>
                <span className="font-medium">{campStats.leaders}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pays représentés */}
        <Card className={`border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white ${
          isRefreshing ? 'opacity-75' : ''
        }`}>
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-600">
                Pays représentés
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-gray-900">
                {paysList.length}
              </div>
              <GrowthBadge indicator={growthIndicators.pays} />
            </div>
            <div className="mt-3 text-xs text-gray-500 leading-relaxed">
              {paysList.length > 0 
                ? paysList.map(pays => pays.name).join(', ')
                : 'Aucun pays disponible'
              }
            </div>
          </CardContent>
        </Card>

        {/* Montant total */}
        <Card className={`border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white ${
          isRefreshing ? 'opacity-75' : ''
        }`}>
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                 <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">XAF</span>
              </div>
              <CardTitle className="text-sm font-medium text-gray-600">
                Montant total
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(totalAmount)}
              </div>
              <span className="text-sm font-medium text-gray-500 ml-1">FCFA</span>
              <GrowthBadge indicator={growthIndicators.revenue} />
            </div>
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Camp des agneaux :</span>
                <span className="font-medium">{formatCurrency(campAmounts.agneaux)} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Camp de la fondation:</span>
                <span className="font-medium">{formatCurrency(campAmounts.fondation)} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Camp des leaders:</span>
                <span className="font-medium">{formatCurrency(campAmounts.leaders)} FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}