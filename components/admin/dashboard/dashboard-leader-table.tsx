import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const leaders = [
  {
    id: 1,
    name: "Jean Dupont",
    location: "Paris, France",
    center: "Centre Évangélique",
    participants: 45,
    status: "active",
  },
  {
    id: 2,
    name: "Marie Koné",
    location: "Abidjan, Côte d'Ivoire",
    center: "Église de la Grâce",
    participants: 38,
    status: "active",
  },
  {
    id: 3,
    name: "Paul Mbarga",
    location: "Douala, Cameroun",
    center: "Centre de la Foi",
    participants: 27,
    status: "active",
  },
  {
    id: 4,
    name: "Sophie Martin",
    location: "Lyon, France",
    center: "Assemblée du Réveil",
    participants: 31,
    status: "active",
  },
  {
    id: 5,
    name: "Thomas Diallo",
    location: "Dakar, Sénégal",
    center: "Église de la Paix",
    participants: 22,
    status: "pending",
  },
  
]

export function DashboardLeaderTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par dirigeant</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dirigeant</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Centre</TableHead>
              <TableHead className="text-right">Participants</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaders.map((leader) => (
              <TableRow key={leader.id}>
                <TableCell className="font-medium">{leader.name}</TableCell>
                <TableCell>{leader.location}</TableCell>
                <TableCell>{leader.center}</TableCell>
                <TableCell className="text-right">{leader.participants}</TableCell>
                <TableCell>
                  <Badge variant={leader.status === "active" ? "default" : "outline"}>
                    {leader.status === "active" ? "Actif" : "En attente"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
