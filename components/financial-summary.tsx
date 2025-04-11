"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, CreditCard, DollarSign, Wallet } from "lucide-react"
import { useTransactions } from "@/context/transaction-context"
import { formatCurrency } from "@/lib/utils"

interface FinancialSummaryProps {
  type: "personal" | "business"
}

export function FinancialSummary({ type }: FinancialSummaryProps) {
  const { transactions } = useTransactions()
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    investment: 0,
  })

  useEffect(() => {
    const filteredTransactions = transactions.filter((t) => t.accountType === type)

    const income = filteredTransactions.filter((t) => t.type === "ingreso").reduce((sum, t) => sum + t.amount, 0)

    const expenses = filteredTransactions.filter((t) => t.type === "egreso").reduce((sum, t) => sum + t.amount, 0)

    const balance = income - expenses

    // Para personal, calculamos el 10% para inversión
    const investment = type === "personal" ? income * 0.1 : 0

    setSummary({
      balance,
      income,
      expenses,
      investment,
    })
  }, [transactions, type])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Balance Total</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold">{formatCurrency(summary.balance)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.balance > 0 ? "+" : ""}
              {Math.round((summary.balance / (summary.income || 1)) * 100)}% balance/ingresos
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
              {formatCurrency(summary.income)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ingresos totales {type === "personal" ? "personales" : "empresariales"}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Gastos</p>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-500">
              {formatCurrency(summary.expenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((summary.expenses / (summary.income || 1)) * 100)}% de tus ingresos
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">
              {type === "personal" ? "Inversiones" : "Ganancias"}
            </p>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-500">
              {formatCurrency(type === "personal" ? summary.investment : summary.balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {type === "personal"
                ? "10% de tus ingresos para invertir"
                : `${Math.round((summary.balance / (summary.income || 1)) * 100)}% margen de ganancia`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
