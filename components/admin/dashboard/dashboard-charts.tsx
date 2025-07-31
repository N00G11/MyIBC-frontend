"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axiosInstance from "@/components/request/reques"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

type PercentageStatDTO = { label: string; value: number }

const COLORS_CAMP = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"]
const COLORS_SEX = ["#3b82f6", "#10b981"]
const COLORS_PAYS = ["#10b981", "#f59e0b", "#8b5cf6", "#6b7280", "#ef4444", "#14b8a6"]
const COLORS_VILLE = ["#ef4444", "#f97316", "#06b6d4", "#8b5cf6", "#6b7280", "#10b981"]
const COLORS_AGE = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6"]

// Helper function to calculate age from date string
function calculateAge(dateString: string): number {
  const birthDate = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// Helper function to group ages into ranges
function groupAgesByRanges(ageData: PercentageStatDTO[]): PercentageStatDTO[] {
  const ageRanges = {
    "3-11 ans": 0,
    "12-17 ans": 0,
    "18-25 ans": 0,
    "26-35 ans": 0,
    "36-50 ans": 0,
    "50+ ans": 0
  }
  
  let totalPercentage = 0
  
  ageData.forEach(item => {
    const age = calculateAge(item.label)
    const percentage = item.value
    totalPercentage += percentage
    
    if (age >= 3 && age <= 11) {
      ageRanges["3-11 ans"] += percentage
    } else if (age >= 12 && age <= 17) {
      ageRanges["12-17 ans"] += percentage
    } else if (age >= 18 && age <= 25) {
      ageRanges["18-25 ans"] += percentage
    } else if (age >= 26 && age <= 35) {
      ageRanges["26-35 ans"] += percentage
    } else if (age >= 36 && age <= 50) {
      ageRanges["36-50 ans"] += percentage
    } else if (age > 50) {
      ageRanges["50+ ans"] += percentage
    }
  })
  
  // Convert to PercentageStatDTO array and normalize percentages
  return Object.entries(ageRanges)
    .filter(([_, value]) => value > 0)
    .map(([label, value]) => ({
      label,
      value: Math.round(value)
    }))
}

export function DashboardCharts() {
  const [stats, setStats] = useState<{
    parCamp: PercentageStatDTO[]
    parSexe: PercentageStatDTO[]
    parPays: PercentageStatDTO[]
    parVille: PercentageStatDTO[]
    parTrancheAge: PercentageStatDTO[]
  }>({
    parCamp: [],
    parSexe: [],
    parPays: [],
    parVille: [],
    parTrancheAge: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/statistique/admin/repartition")
        
        // Process age data to group by age ranges
        const rawAgeData = Array.isArray(res.data.parTrancheAge) ? res.data.parTrancheAge : []
        const processedAgeData = groupAgesByRanges(rawAgeData)
        
        setStats({
          parCamp: Array.isArray(res.data.parCamp) ? res.data.parCamp : [],
          parSexe: Array.isArray(res.data.parSexe) ? res.data.parSexe : [],
          parPays: Array.isArray(res.data.parPays) ? res.data.parPays : [],
          parVille: Array.isArray(res.data.parVille) ? res.data.parVille : [],
          parTrancheAge: processedAgeData,
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
        <CardDescription>Analyse détaillée des participants par différentes catégories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-4 text-center">Par type de camp</h3>
            <div className="h-[250px] flex items-center justify-center">
              <DoughnutChart data={stats.parCamp} colors={COLORS_CAMP} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-4 text-center">Par tranche d'âge</h3>
            <div className="h-[250px] flex items-center justify-center">
              <BarChart data={stats.parTrancheAge} colors={COLORS_AGE} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-4 text-center">Par genre</h3>
            <div className="h-[250px] flex items-center justify-center">
              <PieChart data={stats.parSexe} colors={COLORS_SEX} />
            </div>
          </div>

          {/* Hidden charts - keeping for future use */}
          <div className="hidden">
            <BarChart data={stats.parPays} colors={COLORS_PAYS} />
          </div>
          <div className="hidden">
            <BarChart data={stats.parVille} colors={COLORS_VILLE} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DoughnutChart({ data, colors }: { data: PercentageStatDTO[]; colors: string[] }) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [{
      data: data.map(item => item.value),
      backgroundColor: colors.slice(0, data.length),
      borderWidth: 0,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}%`
          }
        }
      }
    }
  }

  return (
    <div className="w-full h-full">
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

function PieChart({ data, colors }: { data: PercentageStatDTO[]; colors: string[] }) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [{
      data: data.map(item => item.value),
      backgroundColor: colors.slice(0, data.length),
      borderWidth: 0,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}%`
          }
        }
      }
    }
  }

  return (
    <div className="w-full h-full">
      <Pie data={chartData} options={options} />
    </div>
  )
}

function BarChart({ data, colors }: { data: PercentageStatDTO[]; colors: string[] }) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [{
      data: data.map(item => item.value),
      backgroundColor: colors.slice(0, data.length),
      borderRadius: 4,
      borderWidth: 0,
      barThickness: 30,
      maxBarThickness: 35,
      categoryPercentage: 0.6,
      barPercentage: 0.9,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y}%`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { 
          font: { size: 11 },
          callback: function(value: any) {
            return value + '%'
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 0
        },
        categoryPercentage: 0.6,
        barPercentage: 0.9,
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }
  }

  return (
    <div className="w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  )
}
