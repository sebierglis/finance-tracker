"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTransactions } from "@/context/transaction-context"
import { formatCurrency } from "@/lib/utils"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"
import { Download, FileText, PieChartIcon, BarChart3, TrendingUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ReportsPage() {
  const { transactions } = useTransactions()
  const { toast } = useToast()
  const [accountType, setAccountType] = useState<"personal" | "business">("personal")
  const [period, setPeriod] = useState("month")
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [balanceData, setBalanceData] = useState<any[]>([])

  // Colores para los gráficos
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a4de6c",
    "#d0ed57",
  ]

  useEffect(() => {
    // Filtrar transacciones por tipo de cuenta
    const filteredTransactions = transactions.filter((t) => t.accountType === accountType)

    // Datos para el gráfico de categorías
    const expensesByCategory: Record<string, number> = {}
    const incomesByCategory: Record<string, number> = {}

    filteredTransactions.forEach((t) => {
      if (t.type === "egreso") {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount
      } else {
        incomesByCategory[t.category] = (incomesByCategory[t.category] || 0) + t.amount
      }
    })

    const expenseCategoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value,
      type: "egreso",
    }))

    const incomeCategoryData = Object.entries(incomesByCategory).map(([name, value]) => ({
      name,
      value,
      type: "ingreso",
    }))

    setCategoryData([...expenseCategoryData, ...incomeCategoryData])

    // Datos para el gráfico mensual
    const months = getLastNMonths(12)
    const monthlyDataArray = months.map((month) => {
      const monthTransactions = filteredTransactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === month.monthIndex && transactionDate.getFullYear() === month.year
      })

      const income = monthTransactions.filter((t) => t.type === "ingreso").reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions.filter((t) => t.type === "egreso").reduce((sum, t) => sum + t.amount, 0)

      return {
        name: month.shortName,
        ingresos: income,
        gastos: expenses,
        balance: income - expenses,
      }
    })

    setMonthlyData(monthlyDataArray)

    // Datos para el gráfico de balance
    const balanceHistory = monthlyDataArray.map((data, index) => {
      const previousBalance =
        index > 0 ? monthlyDataArray.slice(0, index).reduce((sum, item) => sum + item.balance, 0) : 0

      return {
        name: data.name,
        balance: previousBalance + data.balance,
      }
    })

    setBalanceData(balanceHistory)
  }, [transactions, accountType, period])

  const handleExportReport = () => {
    toast({
      title: "Reporte generado",
      description: "El reporte ha sido generado y descargado correctamente.",
      variant: "default",
    })
  }

  // Función para formatear valores en el tooltip
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value)
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reportes Financieros</h1>
          <p className="text-muted-foreground">Analiza tus finanzas con reportes detallados y gráficos.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generar PDF
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Datos
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Tabs
          defaultValue="personal"
          value={accountType}
          onValueChange={(value) => setAccountType(value as "personal" | "business")}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="business">Empresarial</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mensual</SelectItem>
              <SelectItem value="quarter">Trimestral</SelectItem>
              <SelectItem value="year">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Gastos por Categoría</CardTitle>
              <CardDescription>Distribución de gastos por categoría</CardDescription>
            </div>
            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.filter((item) => item.type === "egreso")}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData
                      .filter((item) => item.type === "egreso")
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value), "Monto"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Ingresos por Categoría</CardTitle>
              <CardDescription>Distribución de ingresos por categoría</CardDescription>
            </div>
            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.filter((item) => item.type === "ingreso")}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData
                      .filter((item) => item.type === "ingreso")
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value), "Monto"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Ingresos vs Gastos</CardTitle>
              <CardDescription>Comparativa mensual de ingresos y gastos</CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value > 999 ? `${(value / 1000).toFixed(0)}k` : value}`} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), undefined]} />
                  <Legend />
                  <Bar name="Ingresos" dataKey="ingresos" fill="hsl(var(--primary))" />
                  <Bar name="Gastos" dataKey="gastos" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Evolución del Balance</CardTitle>
              <CardDescription>Tendencia del balance a lo largo del tiempo</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value > 999 ? `${(value / 1000).toFixed(0)}k` : value}`} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), "Balance"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="hsl(var(--primary))"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Función auxiliar para obtener los últimos N meses
function getLastNMonths(n: number) {
  const months = []
  const today = new Date()

  for (let i = 0; i < n; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.unshift({
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
      shortName: date.toLocaleString("es-ES", { month: "short" }),
    })
  }

  return months
}
