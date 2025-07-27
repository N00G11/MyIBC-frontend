import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, FileIcon as FilePdf} from "lucide-react"

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
      </CardContent>
    </Card>
  )
}
