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
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

const campTypes = [
  {
    id: 1,
    name: "Camp des Agneaux",
    ageRange: "7-12 ans",
    amount: 50,
    currency: "EUR",
    participants: 320,
    status: "active",
  },
  {
    id: 2,
    name: "Camp des Jeunes",
    ageRange: "13-25 ans",
    amount: 75,
    currency: "EUR",
    participants: 580,
    status: "active",
  },
  {
    id: 3,
    name: "Camp des Leaders",
    ageRange: "26+ ans",
    amount: 100,
    currency: "EUR",
    participants: 348,
    status: "active",
  },
]

export function CampTypesList() {
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
                <TableHead>Statut</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campTypes.map((camp) => (
                <TableRow key={camp.id}>
                  <TableCell className="font-medium">{camp.name}</TableCell>
                  <TableCell>{camp.ageRange}</TableCell>
                  <TableCell>
                    {camp.amount} {camp.currency}
                  </TableCell>
                  <TableCell className="text-right">{camp.participants}</TableCell>
                  <TableCell>
                    <Badge variant={camp.status === "active" ? "default" : "outline"}>
                      {camp.status === "active" ? "Actif" : "Inactif"}
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
