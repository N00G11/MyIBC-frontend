"use client";

import { useEffect, useState } from "react";
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
import { Search, FileText, Mail, Phone } from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../request/reques";

// -----------------------
// Types
// -----------------------
interface Participant {
  id: number;
  username: string;
  sexe: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  ville: string;
}

interface Camp {
  type: string;
  prix: number;
}

interface Inscription {
  id: number;
  participant: Participant;
  camp: Camp;
  montant?: number;
  status?: "confirmed" | "pending";
}

type Status = "confirmed" | "pending";

interface FormattedParticipant {
  id: number;
  name: string;
  gender: string;
  age: number;
  campType: string;
  email: string;
  phone: string;
  city: string;
  status: Status;
  amount: number;
}

// -----------------------
// Fonction utilitaire
// -----------------------
function getAge(dateString: string): number {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// -----------------------
// Composant principal
// -----------------------
export function LeaderParticipantsList() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [participants, setParticipants] = useState<FormattedParticipant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!email) return;

    const fetchParticipants = async () => {
      try {
        const response = await axiosInstance.get<Inscription[]>(
          `/statistique/dirigeant/allParticipants/${email}`
        );
        const data = response.data;

        const mapped: FormattedParticipant[] = data.map((inscription) => ({
          id: inscription.id,
          name: inscription.participant.username,
          gender: inscription.participant.sexe,
          age: getAge(inscription.participant.dateNaissance),
          campType: inscription.camp.type,
          email: inscription.participant.email,
          phone: inscription.participant.telephone,
          city: inscription.participant.ville,
          status: inscription.status ?? "confirmed",
          amount: inscription.camp.prix ?? 0,
        }));

        setParticipants(mapped);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Erreur lors du chargement des participants:", error.message);
        } else {
          console.error("Erreur inconnue lors du chargement des participants");
        }
      }
    };

    fetchParticipants();
  }, [email]);

  const filteredParticipants = participants.filter((p) =>
    [p.name, p.campType, p.email, p.phone, p.city].some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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

  if (!email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Paramètre <strong>email</strong> manquant dans l'URL.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {/* Remplacement de CardHeader par div pour éviter bouton imbriqué */}
      <div className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
        <CardTitle>Liste des participants</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-[200px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Rechercher des participants"
          />
        </div>
      </div>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Camp</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.age} ans</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.campType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{p.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{p.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{p.amount} FCFA</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "confirmed" ? "default" : "outline"}>
                        {p.status === "confirmed" ? "Confirmé" : "En attente"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucun participant trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
      </CardContent>
    </Card>
  );
}
