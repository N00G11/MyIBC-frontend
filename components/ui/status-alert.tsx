import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface StatusAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

export function StatusAlert({ type, message, className = "" }: StatusAlertProps) {
  const getAlertProps = () => {
    switch (type) {
      case 'success':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          className: `border-green-200 bg-green-50 text-green-800 ${className}`
        };
      case 'error':
        return {
          variant: 'destructive' as const,
          icon: AlertCircle,
          className: className
        };
      case 'warning':
        return {
          variant: 'default' as const,
          icon: AlertTriangle,
          className: `border-yellow-200 bg-yellow-50 text-yellow-800 ${className}`
        };
      case 'info':
        return {
          variant: 'default' as const,
          icon: Info,
          className: `border-blue-200 bg-blue-50 text-blue-800 ${className}`
        };
      default:
        return {
          variant: 'default' as const,
          icon: Info,
          className: className
        };
    }
  };

  const { variant, icon: Icon, className: alertClassName } = getAlertProps();

  return (
    <Alert variant={variant} className={alertClassName}>
      <Icon className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
