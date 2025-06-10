import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileSpreadsheet,
  Mail,
  Users,
  UserPlus,
  FileText,
} from "lucide-react";
import { AddLeaderDialog } from "./add-leader-dialog";

export function LeaderActions() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full flex items-center justify-start gap-2 bg-[#D4AF37] hover:bg-[#c09c31] text-white">
            <AddLeaderDialog/>
          </Button>

          <Button
            className="w-full flex items-center justify-start gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Exporter ma liste
            <FileSpreadsheet className="h-4 w-4 ml-auto" />
          </Button>

          <Button
            className="w-full flex items-center justify-start gap-2"
            variant="outline"
          >
            <FileText className="h-4 w-4" />
            Générer tous les badges
          </Button>

          <Button
            className="w-full flex items-center justify-start gap-2"
            variant="outline"
          >
            <Mail className="h-4 w-4" />
            Envoyer email de groupe
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations du dirigeant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nom</label>
            <p className="text-base font-semibold">Jean Dupont</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Centre</label>
            <p className="text-base">Centre Évangélique</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Zone</label>
            <p className="text-base">Paris, France</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Co-dirigeant
            </label>
            <p className="text-base">Marie Lambert</p>
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Responsable de 45 participants</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résumé financier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Camp des Agneaux (12)</span>
              <span className="font-semibold">600 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Camp des Jeunes (25)</span>
              <span className="font-semibold">1,875 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Camp des Leaders (8)</span>
              <span className="font-semibold">800 €</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-bold text-[#001F5B]">
                <span>Total</span>
                <span>3,275 €</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                À titre informatif
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
