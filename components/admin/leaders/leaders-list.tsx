"use client";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Search, Trash } from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { AddLeaderDialog } from "./add-leader-dialog";
import axiosInstance from "@/components/request/reques";
import { EditLeaderDialog } from "./EditLeaderDialog";

type Leader = {
  id: number;
  username: string;
  email: string;
  telephone: string;
  pays: string;
  ville: string;
  delegation: string;
  participants: number;
};

export function LeadersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [allLeaders, setAllLeaders] = useState<Leader[]>([]);

  const filteredLeaders = allLeaders.filter(
    (leader) =>
      leader.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.delegation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage, pageSize, totalPages, totalItems, paginatedData,
    goToPage, setPageSize, canGoNext, canGoPrevious, getPageNumbers,
  } = usePagination({
    data: filteredLeaders,
    initialPageSize: 10,
  });

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get("/dirigeant/all");
      const leaderData = await response.data;
      const leaders: Leader[] = Array.isArray(leaderData) ? leaderData : leaderData.leaders || [];
      setAllLeaders(leaders);
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce dirigeant ?")) return;
    try {
      await axiosInstance.delete(`/dirigeant/delete/${id}`);
      fetchLeaders();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-center justify-between">
        <CardTitle>Liste des dirigeants</CardTitle>
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
          <AddLeaderDialog />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Adresse email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead className="text-right">Participants</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((leader) => (
                <TableRow key={leader.id}>
                  <TableCell className="font-medium">{leader.username}</TableCell>
                  <TableCell>{leader.email}</TableCell>
                  <TableCell>{leader.telephone}</TableCell>
                  <TableCell>{leader.ville}</TableCell>
                  <TableCell>{leader.pays}</TableCell>
                  <TableCell>{leader.delegation}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{leader.participants}</Badge>
                  </TableCell>
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
                          <EditLeaderDialog leader={leader} onSuccess={fetchLeaders} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(leader.id)}
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
}
