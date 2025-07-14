"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DollarSign, Users, Calendar, MapPin, Heart, BookOpen, Crown, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type CampType = {
  id: number;
  type: string;
  description: string;
  trancheAge: string;
  prix: number;
  devise: string;
  participants: number;
};

const fakeCampData: CampType[] = [
  {
    id: 1,
    type: "Agneaux",
    description:
      "Un camp spécialement conçu pour les plus petits, avec des histoires bibliques, des chants, des jeux éducatifs et des activités créatives pour découvrir l'amour de Dieu.",
    trancheAge: "6-10",
    prix: 180,
    devise: "€",
    participants: 25,
  },
  {
    id: 2,
    type: "Jeunes",
    description:
      "Un programme dynamique pour les adolescents incluant des études bibliques interactives, des témoignages, des activités sportives et des temps de louange.",
    trancheAge: "11-17",
    prix: 220,
    devise: "€",
    participants: 30,
  },
  {
    id: 3,
    type: "Leaders",
    description:
      "Formation approfondie pour les futurs leaders chrétiens : enseignements bibliques, développement du leadership, mentorat et service communautaire.",
    trancheAge: "18-25",
    prix: 280,
    devise: "€",
    participants: 15,
  },
];

// Thèmes bibliques pour chaque camp
const campThemes = {
  "Agneaux": {
    primary: "from-sky-400 to-blue-500",
    secondary: "from-sky-50 to-blue-50",
    accent: "text-sky-600",
    border: "border-sky-200",
    icon: Heart,
    bgPattern: "bg-sky-50",
    verse: "« Laissez venir à moi les petits enfants » - Marc 10:14"
  },
  "Jeunes": {
    primary: "from-emerald-400 to-green-500",
    secondary: "from-emerald-50 to-green-50",
    accent: "text-emerald-600",
    border: "border-emerald-200",
    icon: BookOpen,
    bgPattern: "bg-emerald-50",
    verse: "« Que personne ne méprise ta jeunesse » - 1 Timothée 4:12"
  },
  "Leaders": {
    primary: "from-amber-400 to-orange-500",
    secondary: "from-amber-50 to-orange-50",
    accent: "text-amber-600",
    border: "border-amber-200",
    icon: Crown,
    bgPattern: "bg-amber-50",
    verse: "« Soyez mes imitateurs comme je le suis du Christ » - 1 Cor. 11:1"
  }
};

export function CampSelect() {
  const [campTypes, setCampTypes] = useState<CampType[]>([]);
  const email = useSearchParams().get("email");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCampTypes(fakeCampData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/40">
      <div className="space-y-8 p-6">
      {/* Header spirituel */}
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-ibc-navy/5 via-ibc-gold/5 to-ibc-navy/5 rounded-3xl blur-2xl -z-10"></div>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-ibc-gold/30 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-6 w-6 text-ibc-gold" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-ibc-navy to-ibc-gold bg-clip-text text-transparent">
              Camps Bibliques 2024
            </h2>
            <Star className="h-6 w-6 text-ibc-gold" />
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Choisissez le camp qui correspond à votre tranche d'âge
          </p>
          <p className="text-sm text-ibc-navy/80 mt-2 italic">
            "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campTypes.map((camp) => {
          const theme = campThemes[camp.type as keyof typeof campThemes];
          const IconComponent = theme.icon;
          
          return (
            <Card
              key={camp.id}
              className={`group relative overflow-hidden bg-white ${theme.border} border-2 hover:border-ibc-gold/50 cursor-pointer hover:shadow-xl transition-all duration-400 transform hover:-translate-y-1`}
              onClick={() =>
                router.push(`/inscription?id=${camp.id}&email=${email}`)
              }
            >
              {/* Fond pattern subtil */}
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.secondary} opacity-0 group-hover:opacity-100 transition-opacity duration-400`}></div>
              
              {/* Icône décorative en arrière-plan */}
              <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-400">
                <IconComponent className="h-24 w-24 text-ibc-navy" />
              </div>

              <CardHeader className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${theme.primary} text-white font-bold shadow-md`}>
                    <IconComponent className="h-4 w-4" />
                    Camp {camp.type}
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-ibc-navy to-ibc-gold bg-clip-text text-transparent">
                    <Calendar className="h-4 w-4 text-ibc-gold" />
                    <span className="text-sm font-semibold">
                      {camp.trancheAge} ans
                    </span>
                  </div>
                </div>
                
                <div className="text-center mb-3">
                  <p className={`text-xs italic ${theme.accent} font-medium px-4 py-2 ${theme.bgPattern} rounded-lg`}>
                    {theme.verse}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-5">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {camp.description}
                </p>

                {/* Stats avec design chrétien */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-ibc-navy/5 to-ibc-navy/10 rounded-xl border border-ibc-navy/20 group-hover:border-ibc-gold/30 transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-ibc-gold to-ibc-navy rounded-full mb-3 shadow-md">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xl font-bold text-ibc-navy">
                      {camp.prix}€
                    </div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Contribution
                    </div>
                  </div>

                  <div className={`flex flex-col items-center p-4 bg-gradient-to-br ${theme.secondary} rounded-xl ${theme.border} group-hover:shadow-md transition-all duration-300`}>
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${theme.primary} rounded-full mb-3 shadow-md`}>
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className={`text-xl font-bold ${theme.accent}`}>
                      {camp.participants}
                    </div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Participants
                    </div>
                  </div>
                </div>

                {/* Activités principales */}
                <div className={`p-4 ${theme.bgPattern} rounded-xl border ${theme.border}`}>
                  <h4 className={`text-sm font-semibold ${theme.accent} mb-2`}>
                    Activités principales :
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    {camp.type === "Agneaux" && (
                      <>
                        <p>• Histoires bibliques illustrées</p>
                        <p>• Chants et louanges adaptés</p>
                        <p>• Activités créatives et jeux</p>
                      </>
                    )}
                    {camp.type === "Jeunes" && (
                      <>
                        <p>• Études bibliques interactives</p>
                        <p>• Temps de louange et adoration</p>
                        <p>• Activités sportives et défis</p>
                      </>
                    )}
                    {camp.type === "Leaders" && (
                      <>
                        <p>• Formation leadership biblique</p>
                        <p>• Mentorat et accompagnement</p>
                        <p>• Projets de service communautaire</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Bouton d'inscription */}
                <div className="flex items-center justify-center pt-2">
                  <div className={`px-6 py-3 bg-gradient-to-r ${theme.primary} text-white text-sm font-semibold rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}>
                    S'inscrire à ce camp
                  </div>
                </div>
              </CardContent>

              {/* Bordure dorée au survol */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-ibc-gold/30 rounded-lg transition-all duration-400"></div>
            </Card>
          );
        })}
      </div>

      {/* État vide avec message spirituel */}
      {campTypes.length === 0 && (
        <div className="text-center py-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-ibc-navy/5 to-ibc-gold/5 rounded-full blur-2xl"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-ibc-gold/30">
              <div className="text-ibc-gold mb-4">
                <MapPin className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-ibc-navy mb-4">
                Aucun camp programmé
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Les inscriptions pour les camps bibliques ne sont pas encore ouvertes.
              </p>
              <p className="text-sm text-ibc-navy/80 italic mb-6">
                "Il y a un temps pour tout, un temps pour toute chose sous les cieux"
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-ibc-navy to-ibc-gold text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300">
                Actualiser la page
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}