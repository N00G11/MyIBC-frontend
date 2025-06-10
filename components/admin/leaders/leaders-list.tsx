"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Search, Trash, UserPlus } from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { AddLeaderDialog } from "./add-leader-dialog";

const allLeaders = [
  {
    id: 1,
    name: "Jean Dupont",
    city: "Paris",
    country: "France",
    center: "Centre Évangélique",
    coLeader: "Marie Lambert",
    participants: 45,
  },
  {
    id: 2,
    name: "Marie Koné",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    center: "Église de la Grâce",
    coLeader: null,
    participants: 38,
  },
  {
    id: 3,
    name: "Paul Mbarga",
    city: "Douala",
    country: "Cameroun",
    center: "Centre de la Foi",
    coLeader: "Samuel Etoo",
    participants: 27,
  },
  {
    id: 4,
    name: "Sophie Martin",
    city: "Lyon",
    country: "France",
    center: "Assemblée du Réveil",
    coLeader: null,
    participants: 31,
  },
  {
    id: 5,
    name: "Thomas Diallo",
    city: "Dakar",
    country: "Sénégal",
    center: "Église de la Paix",
    coLeader: "Fatou Sow",
    participants: 22,
  },
  {
    id: 6,
    name: "Fatou Sow",
    city: "Bamako",
    country: "Mali",
    center: "Centre de l'Espoir",
    coLeader: "Ibrahim Keita",
    participants: 35,
  },
  {
    id: 7,
    name: "Emmanuel Koffi",
    city: "Lomé",
    country: "Togo",
    center: "Église de la Victoire",
    coLeader: null,
    participants: 28,
  },
  {
    id: 8,
    name: "Grace Mensah",
    city: "Accra",
    country: "Ghana",
    center: "Centre de la Paix",
    coLeader: "Kofi Asante",
    participants: 42,
  },
  {
    id: 9,
    name: "David Ouattara",
    city: "Bouaké",
    country: "Côte d'Ivoire",
    center: "Assemblée de Dieu",
    coLeader: null,
    participants: 33,
  },
  {
    id: 10,
    name: "Sarah Traoré",
    city: "Ouagadougou",
    country: "Burkina Faso",
    center: "Église du Réveil",
    coLeader: "Moussa Sawadogo",
    participants: 29,
  },
  {
    id: 11,
    name: "Pierre Kamara",
    city: "Conakry",
    country: "Guinée",
    center: "Centre de la Foi",
    coLeader: null,
    participants: 26,
  },
  {
    id: 12,
    name: "Aminata Diallo",
    city: "Niamey",
    country: "Niger",
    center: "Église de l'Espoir",
    coLeader: "Harouna Maiga",
    participants: 31,
  },
];

export function LeadersList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeaders = allLeaders.filter(
    (leader) =>
      leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.center.toLowerCase().includes(searchTerm.toLowerCase())
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
    data: filteredLeaders,
    initialPageSize: 10,
  });

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
                <TableHead>Nom</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Co-dirigeant</TableHead>
                <TableHead className="text-right">Participants</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((leader) => (
                <TableRow key={leader.id}>
                  <TableCell className="font-medium">{leader.name}</TableCell>
                  <TableCell>{leader.city}</TableCell>
                  <TableCell>{leader.country}</TableCell>
                  <TableCell>{leader.center}</TableCell>
                  <TableCell>
                    {leader.coLeader ? (
                      leader.coLeader
                    ) : (
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        <UserPlus className="h-3.5 w-3.5 mr-1" />
                        Ajouter
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{leader.participants}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Supprimer
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
