"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Edit,
  FileText,
  MoreHorizontal,
  Search,
  Trash,
} from "lucide-react"
import axiosInstance from "@/components/request/reques"

// TypeScript : définition du type basé sur l'entité Inscription
type Inscription = {
  id: number
  date: string
  participant: {
    username: string
    email: string
    telephone: string
    sexe: string
    dateNaissance: number
    pays: string
    ville: string
    delegation: string
  }
  camp: {
    type: string
  }
  dirigeantAssigne: {
    username: string
  }
}

export function InscriptionsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fonction utilitaire pour calculer l'âge
  const calculerAge = (anneeNaissance: number) => {
    return new Date().getFullYear() - anneeNaissance
  }

  useEffect(() => {
    fetchinscriptions();
  }, [])


  const fetchinscriptions = async () => {
    try {
      setError(null)
      const response = await axiosInstance.get("/inscription/all")
      const inscriptionData = await response.data
      const ins: Inscription[] = Array.isArray(inscriptionData) ? inscriptionData : inscriptionData.ins || []
      setInscriptions(ins)
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  const filtered = inscriptions.filter(
    (ins) =>
      ins.participant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.participant.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.participant.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.camp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.dirigeantAssigne.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des inscriptions</CardTitle>
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
                <TableHead>Nom complet</TableHead>
                <TableHead>Adresse email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Type de camp</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Dirigeant</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inscription) => (
                <TableRow key={inscription.id}>
                  <TableCell className="font-medium">
                    {inscription.participant.username}
                  </TableCell>
                  <TableCell className="font-medium">
                    {inscription.participant.email}
                  </TableCell>
                  <TableCell className="font-medium">
                    {inscription.participant.telephone}
                  </TableCell>
                  <TableCell>{inscription.participant.sexe}</TableCell>
                  <TableCell>
                    {calculerAge(inscription.participant.dateNaissance)}
                  </TableCell>
                  <TableCell>{inscription.camp.type}</TableCell>
                  <TableCell>{inscription.participant.pays}</TableCell>
                  <TableCell>{inscription.participant.ville}</TableCell>
                  <TableCell>{inscription.dirigeantAssigne.username}</TableCell>
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
