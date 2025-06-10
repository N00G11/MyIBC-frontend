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
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Mail, Phone } from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

const myParticipants = [
  {
    id: 1,
    name: "Pierre Dubois",
    gender: "M",
    age: 15,
    campType: "Jeunes",
    email: "pierre.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    city: "Paris",
    status: "confirmed",
    amount: 75,
  },
  {
    id: 2,
    name: "Marie Martin",
    gender: "F",
    age: 17,
    campType: "Jeunes",
    email: "marie.martin@email.com",
    phone: "+33 6 23 45 67 89",
    city: "Paris",
    status: "confirmed",
    amount: 75,
  },
  {
    id: 3,
    name: "Lucas Dupont",
    gender: "M",
    age: 10,
    campType: "Agneaux",
    email: "lucas.dupont@email.com",
    phone: "+33 6 34 56 78 90",
    city: "Paris",
    status: "pending",
    amount: 50,
  },
  {
    id: 4,
    name: "Sophie Bernard",
    gender: "F",
    age: 28,
    campType: "Leaders",
    email: "sophie.bernard@email.com",
    phone: "+33 6 45 67 89 01",
    city: "Paris",
    status: "confirmed",
    amount: 100,
  },
  {
    id: 5,
    name: "Antoine Moreau",
    gender: "M",
    age: 19,
    campType: "Jeunes",
    email: "antoine.moreau@email.com",
    phone: "+33 6 56 78 90 12",
    city: "Paris",
    status: "confirmed",
    amount: 75,
  },
  {
    id: 6,
    name: "Emma Leroy",
    gender: "F",
    age: 11,
    campType: "Agneaux",
    email: "emma.leroy@email.com",
    phone: "+33 6 67 89 01 23",
    city: "Paris",
    status: "confirmed",
    amount: 50,
  },
  {
    id: 7,
    name: "Thomas Petit",
    gender: "M",
    age: 22,
    campType: "Jeunes",
    email: "thomas.petit@email.com",
    phone: "+33 6 78 90 12 34",
    city: "Paris",
    status: "pending",
    amount: 75,
  },
  {
    id: 8,
    name: "Camille Roux",
    gender: "F",
    age: 30,
    campType: "Leaders",
    email: "camille.roux@email.com",
    phone: "+33 6 89 01 23 45",
    city: "Paris",
    status: "confirmed",
    amount: 100,
  },
];

export function LeaderParticipantsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParticipants = myParticipants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.campType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste de mes participants</CardTitle>
        <div className="flex items-center gap-2">
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
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">
                    {participant.name}
                  </TableCell>
                  <TableCell>{participant.age} ans</TableCell>
                  <TableCell>
                    <Badge variant="outline">{participant.campType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">
                          {participant.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3" />
                        <span>{participant.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {participant.amount} €
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        participant.status === "confirmed"
                          ? "default"
                          : "outline"
                      }
                    >
                      {participant.status === "confirmed"
                        ? "Confirmé"
                        : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">Générer badge</span>
                    </Button>
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
