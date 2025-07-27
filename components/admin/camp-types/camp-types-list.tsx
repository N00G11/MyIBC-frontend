"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import axiosInstance from "@/components/request/reques"


type campTypes = {
  id: number
  type: string
  trancheAge: string
  prix: number
  devise: string
  participants: number
}


export function CampTypesList() {

  const [error, setError] = useState<string | null>(null)
  const [campTypes, setCampTypes] = useState<campTypes[]>([])
  useEffect(() => {
    fetchCamps();
  }, [])

   const fetchCamps = async () => {
    try {
      setError(null)
      const response = await axiosInstance.get("/camp/all")
      const campData = await response.data
      const camps: campTypes[] = Array.isArray(campData) ? campData : campData.jobs || []
      setCampTypes(camps)
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Types de camps disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du camp</TableHead>
                <TableHead>Tranche d'âge</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead className="text-right">Participants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campTypes.map((camp) => (
                <TableRow key={camp.id}>
                  <TableCell className="font-medium">{camp.type}</TableCell>
                  <TableCell>{camp.trancheAge}</TableCell>
                  <TableCell>
                    {camp.prix} FCFA
                  </TableCell>
                  <TableCell className="text-right">{camp.participants}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
