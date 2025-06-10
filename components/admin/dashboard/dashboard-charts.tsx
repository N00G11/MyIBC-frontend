"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des participants</CardTitle>
        <CardDescription>Analyse des participants par différentes catégories</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs className="relative" defaultValue="camp">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="camp">Par camp</TabsTrigger>
            <TabsTrigger value="gender">Par sexe</TabsTrigger>
            <TabsTrigger value="country">Par pays</TabsTrigger>
            <TabsTrigger value="city">Par ville</TabsTrigger>
          </TabsList>
          <TabsContent value="camp" className="pt-10 pb-0">
            <div className="h-[400px] flex items-center justify-center">
              <div className="flex items-center space-x-8">
                <ChartBar label="Agneaux" value={45} color="#4C51BF" />
                <ChartBar label="Jeunes" value={45} color="#D4AF37" />
                <ChartBar label="Leaders" value={20} color="#001F5B" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="gender" className="pt-4">
            <div className="h-[300px] flex items-center justify-center">
              <div className="flex items-center space-x-8">
                <ChartBar label="Hommes" value={55} color="#3B82F6" />
                <ChartBar label="Femmes" value={45} color="#EC4899" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="country" className="pt-4">
            <div className="h-[300px] flex items-center justify-center">
              <div className="flex items-center space-x-8">
                <ChartBar label="France" value={30} color="#10B981" />
                <ChartBar label="Côte d'Ivoire" value={25} color="#F59E0B" />
                <ChartBar label="Cameroun" value={15} color="#8B5CF6" />
                <ChartBar label="Autres" value={30} color="#6B7280" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="city" className="pt-4">
            <div className="h-[300px] flex items-center justify-center">
              <div className="flex items-center space-x-8">
                <ChartBar label="Paris" value={20} color="#EF4444" />
                <ChartBar label="Abidjan" value={18} color="#F97316" />
                <ChartBar label="Lyon" value={12} color="#06B6D4" />
                <ChartBar label="Douala" value={10} color="#8B5CF6" />
                <ChartBar label="Autres" value={40} color="#6B7280" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ChartBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 mb-2">
        <div
          className="absolute bottom-0 w-full rounded-t-md"
          style={{
            backgroundColor: color,
            height: `${value * 2}px`,
          }}
        />
      </div>
      <div className="text-xs font-medium">{label}</div>
      <div className="text-sm font-bold">{value}%</div>
    </div>
  )
}
