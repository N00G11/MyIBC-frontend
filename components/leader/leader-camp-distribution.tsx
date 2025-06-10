"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const campData = [
  {
    name: "Camp des Jeunes",
    participants: 25,
    total: 45,
    amount: 1875,
    color: "#D4AF37",
    percentage: 56,
  },
  {
    name: "Camp des Agneaux",
    participants: 12,
    total: 45,
    amount: 600,
    color: "#4C51BF",
    percentage: 27,
  },
  {
    name: "Camp des Leaders",
    participants: 8,
    total: 45,
    amount: 800,
    color: "#001F5B",
    percentage: 18,
  },
];

export function LeaderCampDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition de mes participants par camp</CardTitle>
        <CardDescription>
          Distribution et montants par type de camp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {campData.map((camp) => (
            <div key={camp.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: camp.color }}
                  />
                  <span className="font-medium">{camp.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {camp.participants} participants
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {camp.amount} EUR
                  </div>
                </div>
              </div>
              <Progress value={camp.percentage} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{camp.percentage}% du total</span>
                <span>
                  {camp.participants}/{camp.total}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#001F5B]">45</div>
              <div className="text-sm text-muted-foreground">
                Total participants
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#D4AF37]">3,275 €</div>
              <div className="text-sm text-muted-foreground">Montant total</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
