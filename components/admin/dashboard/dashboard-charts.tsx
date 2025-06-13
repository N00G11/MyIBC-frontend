"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosInstance from "@/components/request/reques"

type StatData = { label: string; value: number; color?: string }

const COLORS_CAMP = ["#4C51BF", "#D4AF37", "#001F5B", "#10B981", "#F59E0B"]
const COLORS_SEX = ["#3B82F6", "#EC4899"]
const COLORS_PAYS = ["#10B981", "#F59E0B", "#8B5CF6", "#6B7280"]
const COLORS_VILLE = ["#EF4444", "#F97316", "#06B6D4", "#8B5CF6", "#6B7280"]

export function DashboardCharts() {
  const [stats, setStats] = useState<{
    parCamp: StatData[]
    parSexe: StatData[]
    parPays: StatData[]
    parVille: StatData[]
  }>({
    parCamp: [],
    parSexe: [],
    parPays: [],
    parVille: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/statistique/admin/repartition")
         setStats({
            parCamp: Array.isArray(res.data.parCamp)
              ? res.data.parCamp.map((s: StatData, i: number) => ({
                  ...s,
                  color: COLORS_CAMP[i % COLORS_CAMP.length],
                }))
              : [],
            parSexe: Array.isArray(res.data.parSexe)
              ? res.data.parSexe.map((s: StatData, i: number) => ({
                  ...s,
                  color: COLORS_SEX[i % COLORS_SEX.length],
                }))
              : [],
            parPays: Array.isArray(res.data.parPays)
              ? res.data.parPays.map((s: StatData, i: number) => ({
                  ...s,
                  color: COLORS_PAYS[i % COLORS_PAYS.length],
                }))
              : [],
            parVille: Array.isArray(res.data.parVille)
              ? res.data.parVille.map((s: StatData, i: number) => ({
                  ...s,
                  color: COLORS_VILLE[i % COLORS_VILLE.length],
                }))
              : [],
          })

      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    }
    fetchData()
  }, [])

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
            <ChartBarGroup data={stats.parCamp} />
          </TabsContent>
          <TabsContent value="gender" className="pt-4">
            <ChartBarGroup data={stats.parSexe} />
          </TabsContent>
          <TabsContent value="country" className="pt-4">
            <ChartBarGroup data={stats.parPays} />
          </TabsContent>
          <TabsContent value="city" className="pt-4">
            <ChartBarGroup data={stats.parVille} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ChartBarGroup({ data }: { data: StatData[] }) {
  return (
    <div className="h-[400px] flex items-center justify-center">
      <div className="flex items-center space-x-8">
        {data.map((item, index) => (
          <ChartBar key={index} label={item.label} value={item.value} color={item.color ?? "#999"} />
        ))}
      </div>
    </div>
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
