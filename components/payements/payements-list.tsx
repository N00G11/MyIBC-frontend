"use client";
import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentPagination } from "@/components/ui/payment-pagination";
import { usePaymentRefresh } from "@/hooks/use-payment-refresh";
import { Search, DollarSign, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/components/request/reques";

type Payement = {
  id: number;
  date: string;
  montant: number;
  codeTresorier: string;
  camp: {
    type: string;
  };
  utilisateur: {
    username?: string;
    telephone?: string;
    pays?: string;
  };
};

export function PayementsList() {
  const [payements, setPayements] = useState<Payement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const { refreshTrigger } = usePaymentRefresh();

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/payement/all");
      const data = res.data?.payements || res.data || [];
      setPayements(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des paiements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [refreshTrigger]); // Se recharge quand refreshTrigger change

  // Filtrer et paginer les paiements
  const { filteredPayements, totalPages, paginatedPayements } = useMemo(() => {
    // Filtrage
    const filtered = payements.filter(p => 
      p.utilisateur?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.utilisateur?.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.utilisateur?.pays?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.camp?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codeTresorier?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      filteredPayements: filtered,
      totalPages,
      paginatedPayements: paginated
    };
  }, [payements, searchTerm, currentPage, itemsPerPage]);

  // Reset à la page 1 quand on change la recherche ou items par page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  if (loading) return (
    <div className="flex items-center justify-center h-32">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des paiements...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-md">
      <p className="text-red-800">{error}</p>
    </div>
  );

  const totalAmount = filteredPayements.reduce((sum, p) => sum + p.montant, 0);

  return (
    <div className="mt-8 space-y-6">
      {/* Header avec statistiques */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-semibold text-lg mb-1">Liste des paiements</h2>
          <p className="text-sm text-gray-600">
            {filteredPayements.length} paiement{filteredPayements.length !== 1 ? 's' : ''} trouvé{filteredPayements.length !== 1 ? 's' : ''}
            {searchTerm && ` pour "${searchTerm}"`}
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher par nom, téléphone, pays, camp ou code trésorier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tableau des paiements */}
      {paginatedPayements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun paiement trouvé</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `Aucun paiement ne correspond à "${searchTerm}"`
              : "Aucun paiement enregistré pour le moment"
            }
          </p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Nom complet</TableHead>
                  <TableHead className="font-semibold">Téléphone</TableHead>
                  <TableHead className="font-semibold">Pays</TableHead>
                  <TableHead className="font-semibold">Camp</TableHead>
                  <TableHead className="font-semibold">Montant</TableHead>
                  <TableHead className="font-semibold">Code Trésorier</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayements.map((p) => (
                  <TableRow key={p.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {p.utilisateur?.username || (
                        <span className="text-gray-400 italic">Non renseigné</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {p.utilisateur?.telephone || (
                        <span className="text-gray-400 italic">Non renseigné</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {p.utilisateur?.pays || (
                        <span className="text-gray-400 italic">Non renseigné</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {p.camp?.type || "Non spécifié"}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-blue-700">
                      {p.montant?.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-purple-700 bg-purple-100 px-2 py-1 rounded text-sm">
                        {p.codeTresorier || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(p.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <PaymentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPayements.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </>
      )}
    </div>
  );
}