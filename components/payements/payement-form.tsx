"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserNotFoundMessage, PaymentSuccessMessage } from "@/components/ui/payment-messages";
import { usePaymentRefresh } from "@/hooks/use-payment-refresh";
import { getUserCode } from "@/lib/auth-utils";
import { Search, User, CreditCard, RefreshCw } from "lucide-react";
import axiosInstance from "@/components/request/reques";

interface Utilisateur {
  id: number;
  username: string;
  code: string;
  // Alternative field names that might come from API
  campAgneauxAmount?: number;
  campFondationAmount?: number;
  campLeadersAmount?: number;
  [key: string]: any; // Allow for other possible fields
}

interface PaymentSuccess {
  camp: string;
  username: string;
  amount: number;
}

export function PayementForm() {
  const [code, setCode] = useState("");
  const [tresorierCode, setTresorierCode] = useState<string | null>(null);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<PaymentSuccess | null>(null);
  const [loading, setLoading] = useState(false);
  const [payingCamp, setPayingCamp] = useState<string | null>(null);
  
  const { triggerRefresh } = usePaymentRefresh();

  useEffect(() => {
    // Récupérer le code du trésorier depuis localStorage
    const storedTresorierCode = getUserCode('ROLE_TRESORIER');
    setTresorierCode(storedTresorierCode);
  }, []);

  const resetMessages = () => {
    setUserNotFound(false);
    setPaymentSuccess(null);
  };

  const handleSearch = async () => {
    resetMessages();
    setUtilisateur(null);
    
    if (!code.trim()) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/statistique/utilisateur/code/${code}`);
      console.log('User data from API:', res.data); // Debug log to see actual structure
      setUtilisateur(res.data);
    } catch (err: any) {
      setUserNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (camp: "Camp des Agneaux" | "Camp de la Fondation" | "Camp des Leaders") => {
    resetMessages();
    
    if (!tresorierCode) {
      return;
    }
    
    if (!utilisateur) return;
    
    // Try multiple possible field names for amounts
    const campAmounts = {
      "Camp des Agneaux": utilisateur.campAgneauxAmount || 0,
      "Camp de la Fondation": utilisateur.campFondationAmount || 0,
      "Camp des Leaders": utilisateur.campLeaderAmount || utilisateur.campLeadersAmount || 0
    };
    
    setPayingCamp(camp);
    
    try {
      await axiosInstance.post(`/payement/add/${camp}/${code}/${tresorierCode}`);
      
      setPaymentSuccess({
        camp,
        username: utilisateur.username,
        amount: campAmounts[camp]
      });
      
      // Recharger les données de l'utilisateur pour mettre à jour les montants
      await handleSearch();
      
      // Déclencher le rafraîchissement de la liste des paiements
      triggerRefresh();
    } catch (err: any) {
      // En cas d'erreur, on peut afficher un message d'erreur spécifique
    } finally {
      setPayingCamp(null);
    }
  };

  const handleNewPayment = () => {
    setUtilisateur(null);
    setCode("");
    resetMessages();
  };

  const handleRetry = () => {
    setCode("");
    resetMessages();
  };

  return (
    <div className="w-full space-y-6">
      {/* Messages de succès et d'erreur */}
      {paymentSuccess && (
        <PaymentSuccessMessage
          camp={paymentSuccess.camp}
          username={paymentSuccess.username}
          amount={paymentSuccess.amount}
          onNewPayment={handleNewPayment}
        />
      )}

      {userNotFound && (
        <UserNotFoundMessage
          code={code}
          onRetry={handleRetry}
        />
      )}

      {/* Formulaire principal */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Saisir un nouveau paiement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!utilisateur ? (
            <div className="space-y-6">
              <div className="text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Rechercher un utilisateur
                </h3>
                <p className="text-gray-600">
                  Entrez le code personnel de l'utilisateur pour commencer
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Code personnel de l'utilisateur"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                    className="pl-10 h-12 text-base w-full"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                  disabled={loading || !code.trim()}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Recherche en cours...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Rechercher l'utilisateur
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Informations utilisateur */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations de l'utilisateur
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Nom d'utilisateur</span>
                    <p className="text-lg font-semibold">{utilisateur.username}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Code personnel</span>
                    <p className="font-mono text-blue-700 bg-blue-100 px-3 py-1 rounded-md inline-block">
                      {utilisateur.code}
                    </p>
                  </div>
                </div>
              </div>

              {/* Options de paiement */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Montants disponibles
                </h3>
                <div className="space-y-3">
                  {[
                    { 
                      name: "Camp des Agneaux", 
                      amount: utilisateur.campAgneauxAmount || 0,
                      color: "bg-green-100 text-green-800 border-green-200"
                    },
                    { 
                      name: "Camp de la Fondation", 
                      amount: utilisateur.campFondationAmount || 0,
                      color: "bg-blue-100 text-blue-800 border-blue-200"
                    },
                    { 
                      name: "Camp des Leaders", 
                      amount: utilisateur.campLeaderAmount || utilisateur.campLeadersAmount || 0,
                      color: "bg-purple-100 text-purple-800 border-purple-200"
                    }
                  ].map((camp) => (
                    <div key={camp.name} className={`p-3 rounded-lg border-2 ${camp.color}`}>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">{camp.name}</h4>
                        <p className="text-xl font-bold">{camp.amount.toLocaleString()} FCFA</p>
                        <Button
                          onClick={() => handlePay(camp.name as any)}
                          disabled={payingCamp === camp.name || camp.amount <= 0}
                          className="w-full bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                          size="sm"
                        >
                          {payingCamp === camp.name ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Traitement...
                            </>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Valider
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleNewPayment}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Trouver un utilisateur
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}