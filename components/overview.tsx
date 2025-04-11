"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useTransactions } from "@/context/transaction-context"
import { formatCurrency } from "@/lib/utils"

interface OverviewProps {
  type?: "personal" | "business"
}

export function Overview({ type = "personal" }: OverviewProps) {
  const { transactions } = useTransactions()
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Filtrar transacciones por tipo de cuenta
    const filteredTransactions = transactions.filter((t) => t.accountType === type)

    // Obtener los últimos 6 meses
    const last6Months = getLastNMonths(6)

    // Preparar datos para el gráfico
    const data = last6Months.map((month) => {
      const monthTransactions = filteredTransactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === month.monthIndex && transactionDate.getFullYear() === month.year
      })

      const monthlyIncome = monthTransactions.filter((t) => t.type === "ingreso").reduce((sum, t) => sum + t.amount, 0)

      const monthlyExpenses = monthTransactions.filter((t) => t.type === "egreso").reduce((sum, t) => sum + t.amount, 0)

      return {
        name: month.shortName,
        ingresos: monthlyIncome,
        gastos: monthlyExpenses,
      }
    })

    setChartData(data)
  }, [transactions, type])

  // Función para formatear valores en el tooltip
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value)
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value > 999 ? `${(value / 1000).toFixed(0)}k` : value}`}
        />
        <Tooltip
          formatter={(value: number) => [formatTooltipValue(value), undefined]}
          labelFormatter={(label) => `Mes: ${label}`}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
          }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Legend />
        <Bar name="Ingresos" dataKey="ingresos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar name="Gastos" dataKey="gastos" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
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
