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
import { Search, Trash, CheckCircle2, XCircle } from "lucide-react";
import axiosInstance from "@/components/request/reques";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

type Inscription = {
  id: number;
  date: string;
  nom: string;
  prenom: string;
  sexe: string;
  telephone: string;
  dateNaissance: string;
  pays: string;
  ville: string;
  delegation: string;
  code: string;
  badge: boolean;
  camp: {
    id: number;
    type: string;
    prix: number;
  };
  utilisateur: {
    id: number;
    username: string;
    email: string;
  };
};

export function InscriptionsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculerAge = (dateNaissance: string): number => {
    try {
      if (!dateNaissance) return 0;
      
      const today = new Date();
      const birthDate = new Date(dateNaissance);
      
      if (isNaN(birthDate.getTime())) return 0;
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= 0 && age <= 150 ? age : 0;
    } catch (error) {
      console.warn("Erreur lors du calcul de l'âge:", error);
      return 0;
    }
  };

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const fetchInscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/inscription/all");
      const data = response.data;
      const ins: Inscription[] = Array.isArray(data) ? data : data.ins || [];
      setInscriptions(ins);
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
      setInscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette inscription ?")) return;
    try {
      await axiosInstance.delete(`/inscription/delete/${id}`);
      fetchInscriptions();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const filtered = inscriptions.filter((ins) => {
    if (!searchTerm.trim()) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    const nomComplet = `${ins.nom || ''} ${ins.prenom || ''}`.toLowerCase();
    const telephone = (ins.telephone || '').toLowerCase();
    const pays = (ins.pays || '').toLowerCase();
    const ville = (ins.ville || '').toLowerCase();
    const delegation = (ins.delegation || '').toLowerCase();
    const campType = (ins.camp?.type || '').toLowerCase();
    const utilisateur = (ins.utilisateur?.username || '').toLowerCase();
    const code = (ins.code || '').toLowerCase();
    
    return (
      nomComplet.includes(searchTermLower) ||
      telephone.includes(searchTermLower) ||
      pays.includes(searchTermLower) ||
      ville.includes(searchTermLower) ||
      delegation.includes(searchTermLower) ||
      campType.includes(searchTermLower) ||
      utilisateur.includes(searchTermLower) ||
      code.includes(searchTermLower)
    );
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
    data: filtered,
    initialPageSize: 10,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-center justify-between">
        <CardTitle>Liste des inscriptions</CardTitle>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par nom, code, téléphone, ville..."
              className="w-[280px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Type de camp</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Localitée</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8">
                    Chargement des inscriptions...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((ins) => (
                  <TableRow key={ins.id}>
                    <TableCell className="font-medium">
                      {`${ins.nom || ''} ${ins.prenom || ''}`.trim() || 'Nom non défini'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className="font-mono text-sm bg-blue-100 text-blue-800 border border-blue-300 px-2 py-1"
                      >
                        {ins.code || 'Non défini'}
                      </Badge>
                    </TableCell>
                    <TableCell>{ins.telephone || 'Non renseigné'}</TableCell>
                    <TableCell>{ins.sexe || 'Non spécifié'}</TableCell>
                    <TableCell>{calculerAge(ins.dateNaissance)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-sm">
                        {ins.camp?.type || 'Camp non défini'}
                      </Badge>
                    </TableCell>
                    <TableCell>{ins.pays || 'Non renseigné'}</TableCell>
                    <TableCell>{ins.ville || 'Non renseignée'}</TableCell>
                    <TableCell>{ins.delegation || 'Non renseignée'}</TableCell>
                    <TableCell>{ins.utilisateur?.username || 'Non assigné'}</TableCell>
                    <TableCell>
                      {ins.badge ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => handleDelete(ins.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                    {searchTerm ? "Aucune inscription ne correspond à votre recherche." : "Aucune inscription trouvée."}
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
