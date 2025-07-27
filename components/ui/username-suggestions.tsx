import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface UsernameSuggestionsProps {
  originalUsername: string;
  onSelectSuggestion: (username: string) => void;
  className?: string;
}

export function UsernameSuggestions({ originalUsername, onSelectSuggestion, className = "" }: UsernameSuggestionsProps) {
  const generateSuggestions = (username: string): string[] => {
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const suggestions: string[] = [];
    
    // Suggestions avec des suffixes numériques
    for (let i = 1; i <= 3; i++) {
      suggestions.push(`${cleanUsername}${i}`);
    }
    
    // Suggestions avec l'année actuelle
    const currentYear = new Date().getFullYear();
    suggestions.push(`${cleanUsername}${currentYear}`);
    
    // Suggestions avec des suffixes textuels
    const suffixes = ['_user', '_ibc', '_new'];
    suffixes.forEach(suffix => {
      suggestions.push(`${cleanUsername}${suffix}`);
    });
    
    // Limiter à 6 suggestions maximum
    return suggestions.slice(0, 6);
  };

  const suggestions = generateSuggestions(originalUsername);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className={`border-amber-200 bg-amber-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Suggestions de noms d'utilisateur
        </CardTitle>
        <CardDescription className="text-xs text-amber-700">
          Essayez l'une de ces alternatives disponibles :
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-8 text-xs border-amber-300 hover:bg-amber-100 hover:border-amber-400"
              onClick={() => onSelectSuggestion(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
