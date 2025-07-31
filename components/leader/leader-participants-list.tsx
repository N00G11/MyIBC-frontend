"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2 } from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import axiosInstance from "../request/reques";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface Camp {
  type: string;
  prix: number;
  trancheAge?: string;
  description?: string;
  participants?: number;
  id: number;
}

interface Pays {
  id: number;
  name: string;
  villes?: Ville[];
}

interface Ville {
  id: number;
  name: string;
  delegations?: Delegation[];
}

interface Delegation {
  id: number;
  name: string;
}

interface Utilisateur {
  id: number;
  username: string;
  password: string;
  role: string;
  pays: any;
  telephone: any;
  code: string;
  campAgneauxAmount: number;
  campFondationAmount: number;
  campLeaderAmount: number;
}

interface Inscription {
  badge: boolean;
  id: number;
  date: string;
  nomComplet: string;
  sexe: string;
  dateNaissance: string;
  telephone: string;
  pays: Pays | string; // Support both old and new structure
  ville: Ville | string; // Support both old and new structure
  delegation: Delegation | string; // Support both old and new structure
  camp: Camp;
  status?: "confirmed" | "pending";
  code: string;
  utilisateur?: Utilisateur;
}

type Status = "confirmed" | "pending";

interface FormattedParticipant {
  badge: boolean;
  id: number;
  name: string;
  gender: string;
  age: number;
  campType: string;
  phone: string;
  city: string;
  status: Status;
  amount: number;
  code: string;
}

interface CampOption {
  id: number;
  type: string;
}

// Utilitaire pour calcul d'âge
function getAge(dateString: string): number {
  try {
    if (!dateString) return 0;
    
    const today = new Date();
    const birthDate = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(birthDate.getTime())) return 0;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // S'assurer que l'âge est positif et réaliste
    return age >= 0 && age <= 150 ? age : 0;
  } catch (error) {
    console.warn("Erreur lors du calcul de l'âge:", error);
    return 0;
  }
}

// Composant principal
export function LeaderParticipantsList() {
  const [code, setCode] = useState<string | null>(null);
  const [participants, setParticipants] = useState<FormattedParticipant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [campOptions, setCampOptions] = useState<CampOption[]>([]);
  const [selectedCamp, setSelectedCamp] = useState<string>("__all__");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCode = localStorage.getItem("code") || localStorage.getItem("tresorierCode");
      setCode(storedCode);
    }
  }, []);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const response = await axiosInstance.get<CampOption[]>("/camp/all");
        const filteredCamps = response.data.filter(
          (camp) => camp.type && camp.type.trim() !== ""
        );
        setCampOptions(filteredCamps);
      } catch (e) {
        console.error("Erreur de chargement des camps:", e);
      }
    };
    fetchCamps();
  }, []);

  useEffect(() => {
    if (!code) return;

    const fetchParticipants = async () => {
      if (!code) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get<Inscription[]>(
          `/statistique/utilisateur/allParticipants/${code}`
        );

        // Vérifier que la réponse contient des données valides
        const data = Array.isArray(response.data) ? response.data : [];

        const mapped: FormattedParticipant[] = data.map((i) => {
          // Helper function to extract string value from object or string
          const extractValue = (value: any, defaultValue: string = 'Non défini'): string => {
            if (!value) return defaultValue;
            if (typeof value === 'string') return value;
            if (typeof value === 'object' && value.name) return value.name;
            return defaultValue;
          };

          return {
            id: i.id || 0,
            name: i.nomComplet || 'Nom non défini',
            gender: i.sexe || 'Non spécifié',
            age: i.dateNaissance ? getAge(i.dateNaissance) : 0,
            campType: i.camp?.type || 'Camp non défini',
            phone: i.telephone || 'Non renseigné',
            city: extractValue(i.ville, 'Ville non renseignée'),
            status: i.status ?? "confirmed",
            amount: i.camp?.prix ?? 0,
            badge: Boolean(i.badge),
            code: i.code || 'Code non défini',
          };
        });

        setParticipants(mapped);
      } catch (error) {
        console.error("Erreur lors du chargement des participants:", error);
        setError("Impossible de charger la liste des participants");
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [code]);

  const filteredParticipants = participants.filter((p) => {
    // Si aucun terme de recherche, appliquer seulement le filtre de camp
    if (!searchTerm.trim()) {
      return selectedCamp === "__all__" || p.campType === selectedCamp;
    }

    // Fonction helper pour nettoyer et normaliser les chaînes
    const normalizeString = (str: string | null | undefined): string => {
      if (!str) return "";
      return str.toString().toLowerCase().trim();
    };

    const searchTermLower = normalizeString(searchTerm);
    
    // Recherche dans tous les champs pertinents
    const searchFields = [
      normalizeString(p.name),
      normalizeString(p.campType),
      normalizeString(p.phone),
      normalizeString(p.city),
      normalizeString(p.code),
      normalizeString(p.gender)
    ];

    const matchesSearch = searchFields.some(field => 
      field.includes(searchTermLower)
    );

    const matchesCamp = selectedCamp === "__all__" || p.campType === selectedCamp;

    return matchesSearch && matchesCamp;
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    setPageSize,
    canGoNext,
    canGoPrevious,
    getPageNumbers,
  } = usePagination({
    data: filteredParticipants,
    initialPageSize: 5,
  });

  const handleGenerateBadge = useCallback(async (participantId: number) => {
    console.log("Badge demandé pour ID:", participantId);
  }, []);

  if (!code) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Paramètre <strong>code</strong> manquant.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg w-full">
      <div className="flex flex-row items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <CardTitle className="text-xl font-bold text-[#001F5B]">Liste des participants</CardTitle>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par nom, code, téléphone, ville..."
              className="w-[320px] pl-10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.trim())}
              aria-label="Rechercher des participants"
            />
          </div>
          <Select value={selectedCamp} onValueChange={setSelectedCamp}>
            <SelectTrigger className="w-[200px] h-10">
              <SelectValue placeholder="Filtrer par camp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tous les camps</SelectItem>
              {campOptions.map((camp) => (
                <SelectItem key={camp.id} value={camp.type}>
                  {camp.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="rounded-md border overflow-x-auto">
          <Table className="w-full min-w-[900px]">
            <TableHeader>
              <TableRow className="h-16">
                <TableHead className="font-semibold text-base w-[180px] px-6">Nom</TableHead>
                <TableHead className="font-semibold text-base w-[120px] px-4">Code</TableHead>
                <TableHead className="font-semibold text-base w-[100px] px-4">Genre</TableHead>
                <TableHead className="font-semibold text-base w-[140px] px-4">Téléphone</TableHead>
                <TableHead className="font-semibold text-base w-[120px] px-4">Ville</TableHead>
                <TableHead className="font-semibold text-base w-[140px] px-4">Type de camp</TableHead>
                <TableHead className="font-semibold text-base text-center w-[100px] px-4">Badge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500 text-base">
                    Chargement des participants...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-red-500 text-base">
                    {error}
                  </TableCell>
                </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((p) => (
                  <TableRow key={p.id} className="h-18 hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-base py-5 px-6">{p.name}</TableCell>
                    <TableCell className="py-5 px-4">
                      <Badge 
                        variant="secondary" 
                        className="font-mono text-sm bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1.5"
                      >
                        {p.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-base py-5 px-4">{p.gender}</TableCell>
                    <TableCell className="text-base py-5 px-4">{p.phone}</TableCell>
                    <TableCell className="text-base py-5 px-4">{p.city}</TableCell>
                    <TableCell className="py-5 px-4">
                      <Badge variant="outline" className="text-sm px-3 py-1.5">{p.campType}</Badge>
                    </TableCell>
                    <TableCell className="text-center py-5 px-4">
                      <Button
                        size="sm"
                        disabled={!p.badge}
                        onClick={() => handleGenerateBadge(p.id)}
                        variant="ghost"
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Générer badge"
                      >
                        <CheckCircle2
                          className={`h-6 w-6 ${p.badge ? "text-green-600" : "text-gray-400"}`}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500 text-base">
                    {searchTerm || selectedCamp !== "__all__" 
                      ? "Aucun participant ne correspond à votre recherche." 
                      : "Aucun participant trouvé."
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={goToPage}
            onPageSizeChange={setPageSize}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            getPageNumbers={getPageNumbers}
          />
        </div>
      </CardContent>
    </Card>
  );
}
