import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Check, X } from 'lucide-react';

interface UsernameHelpProps {
  username: string;
  className?: string;
}

export function UsernameHelp({ username, className = "" }: UsernameHelpProps) {
  const rules = [
    {
      id: 'length',
      label: 'Au moins 2 caractères',
      isValid: username.trim().length >= 2,
      isApplicable: true
    },
    {
      id: 'maxLength',
      label: 'Maximum 50 caractères',
      isValid: username.trim().length <= 50,
      isApplicable: username.trim().length > 0
    },
    {
      id: 'noSpecialChars',
      label: 'Pas de caractères interdits (<>\'\"&;)',
      isValid: !/[<>'"&;]/.test(username),
      isApplicable: username.trim().length > 0
    }
  ];

  const applicableRules = rules.filter(rule => rule.isApplicable);
  const allValid = applicableRules.every(rule => rule.isValid);

  if (username.trim().length === 0) {
    return null;
  }

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Règles du nom d'utilisateur
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {applicableRules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-2 text-xs">
              {rule.isValid ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <X className="h-3 w-3 text-red-600" />
              )}
              <span className={rule.isValid ? "text-green-700" : "text-red-700"}>
                {rule.label}
              </span>
            </div>
          ))}
        </div>
        {allValid && (
          <p className="text-xs text-green-700 mt-2 font-medium">
            ✓ Nom d'utilisateur valide
          </p>
        )}
      </CardContent>
    </Card>
  );
}
