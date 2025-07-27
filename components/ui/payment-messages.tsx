"use client";

import { AlertCircle, CheckCircle, User, CreditCard, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserNotFoundMessageProps {
  code: string;
  onRetry: () => void;
}

export function UserNotFoundMessage({ code, onRetry }: UserNotFoundMessageProps) {
  return (
    <Alert className="border-red-200 bg-red-50 my-4">
      <AlertCircle className="h-5 w-5 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="space-y-2">
          <p className="font-medium">Utilisateur non trouvé</p>
          <p className="text-sm">
            Aucun utilisateur trouvé avec le code <span className="font-mono bg-red-100 px-1 rounded">{code}</span>
          </p>
          <p className="text-sm text-red-600">
            Vérifiez que le code est correct et réessayez.
          </p>
          <button 
            onClick={onRetry}
            className="text-sm text-red-700 underline hover:no-underline"
          >
            Réessayer avec un autre code
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface PaymentSuccessMessageProps {
  camp: string;
  username: string;
  amount: number;
  onNewPayment: () => void;
}

export function PaymentSuccessMessage({ camp, username, amount, onNewPayment }: PaymentSuccessMessageProps) {
  return (
    <Alert className="border-green-200 bg-green-50 my-4">
      <CheckCircle className="h-5 w-5 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="space-y-3">
          <p className="font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Paiement enregistré avec succès !
          </p>
          <div className="bg-green-100 p-3 rounded-md space-y-1">
            <p className="text-sm">
              <span className="font-medium">Utilisateur :</span> {username}
            </p>
            <p className="text-sm">
              <span className="font-medium">Camp :</span> {camp}
            </p>
            <p className="text-sm">
              <span className="font-medium">Montant :</span> {amount.toLocaleString()} FCFA
            </p>
            <p className="text-sm flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium">Date :</span> {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onNewPayment}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
            >
              Nouveau paiement
            </button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
