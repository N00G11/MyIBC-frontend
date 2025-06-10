"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, FileText, MoreHorizontal, Search, Trash } from "lucide-react"

const initialParticipants = [
  {
    id: 1,
    name: "Pierre Dubois",
    gender: "M",
    age: 15,
    campType: "Jeunes",
    country: "France",
    city: "Paris",
    leader: "Jean Dupont",
    status: "registered",
  },
  {
    id: 2,
    name: "Aminata Diallo",
    gender: "F",
    age: 22,
    campType: "Jeunes",
    country: "Sénégal",
    city: "Dakar",
    leader: "Thomas Diallo",
    status: "registered",
  },
  {
    id: 3,
    name: "Lucas Martin",
    gender: "M",
    age: 10,
    campType: "Agneaux",
    country: "France",
    city: "Lyon",
    leader: "Sophie Martin",
    status: "pending",
  },
  {
    id: 4,
    name: "Kofi Mensah",
    gender: "M",
    age: 28,
    campType: "Leaders",
    country: "Ghana",
    city: "Accra",
    leader: "Jean Dupont",
    status: "registered",
  },
  {
    id: 5,
    name: "Fatou Sow",
    gender: "F",
    age: 18,
    campType: "Jeunes",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    leader: "Marie Koné",
    status: "registered",
  },
]

export function ParticipantsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [participants, setParticipants] = useState(initialParticipants)

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.campType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.leader.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des participants</CardTitle>
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
                <TableHead>Genre</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Type de camp</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Dirigeant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell>{participant.gender}</TableCell>
                  <TableCell>{participant.age}</TableCell>
                  <TableCell>{participant.campType}</TableCell>
                  <TableCell>{participant.country}</TableCell>
                  <TableCell>{participant.city}</TableCell>
                  <TableCell>{participant.leader}</TableCell>
                  <TableCell>
                    <Badge variant={participant.status === "registered" ? "default" : "outline"}>
                      {participant.status === "registered" ? "Inscrit" : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Générer badge
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
      </CardContent>
    </Card>
  )
}
