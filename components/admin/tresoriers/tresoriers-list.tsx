"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Search, Trash } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import axiosInstance from "@/components/request/reques";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { AddTresorierDialog } from "./add-tresorier-dialog";
import { EditTresorierDialog } from "./EditTresorierDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

type Tresorier = {
  id: number;
  username: string;
  email: string;
  telephone: string;
  pays: string;
  code: string;
};

export const TresoriersList = forwardRef(function TresoriersList(props, ref) {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [allTresoriers, setAllTresoriers] = useState<Tresorier[]>([]);

  const filteredTresoriers = allTresoriers.filter(
    (tresorier) =>
      tresorier.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tresorier.telephone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tresorier.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tresorier.code?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const {
    currentPage, pageSize, totalPages, totalItems, paginatedData,
    goToPage, setPageSize, canGoNext, canGoPrevious, getPageNumbers,
  } = usePagination({
    data: filteredTresoriers,
    initialPageSize: 10,
  });

  const fetchTresoriers = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get("/tresoriers");
      const tresorierData = await response.data;
      const tresoriers: Tresorier[] = Array.isArray(tresorierData) ? tresorierData : tresorierData.tresoriers || [];
      setAllTresoriers(tresoriers);
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchTresoriers,
  }));

  useEffect(() => {
    fetchTresoriers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce trésorier ?")) return;
    try {
      await axiosInstance.delete(`/tresorier/delete/${id}`);
      fetchTresoriers();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-center justify-between">
        <CardTitle>Liste des trésoriers</CardTitle>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-[200px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Code trésorier</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((tresorier) => (
                <TableRow key={tresorier.id}>
                  <TableCell className="font-medium">{tresorier.username}</TableCell>
                  <TableCell>{tresorier.telephone}</TableCell>
                  <TableCell>{tresorier.pays}</TableCell>
                  <TableCell>{tresorier.code}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <EditTresorierDialog tresorier={tresorier} onSuccess={fetchTresoriers} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(tresorier.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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
});
TresoriersList.displayName = "TresoriersList";