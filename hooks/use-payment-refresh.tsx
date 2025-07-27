"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PaymentContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <PaymentContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentRefresh() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePaymentRefresh must be used within a PaymentProvider');
  }
  return context;
}
