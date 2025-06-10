import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, FileIcon as FilePdf, Mail, RefreshCw } from "lucide-react"

export function DashboardActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full flex items-center justify-start gap-2" variant="outline">
          <Download className="h-4 w-4" />
          Exporter en Excel
          <FileSpreadsheet className="h-4 w-4 ml-auto" />
        </Button>

        <Button className="w-full flex items-center justify-start gap-2" variant="outline">
          <Download className="h-4 w-4" />
          Exporter en PDF
          <FilePdf className="h-4 w-4 ml-auto" />
        </Button>

        <Button className="w-full flex items-center justify-start gap-2" variant="outline">
          <Mail className="h-4 w-4" />
          Envoyer rapport par email
        </Button>

        <Button className="w-full flex items-center justify-start gap-2" variant="outline">
          <RefreshCw className="h-4 w-4" />
          Actualiser les données
        </Button>

        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            Dernière mise à jour: <span className="font-medium">Aujourd'hui à 14:30</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
