"use client"

import { useEffect, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTransactions } from "@/context/transaction-context"
import { formatDate } from "@/lib/utils"
import type { Transaction } from "@/types"

interface RecentTransactionsProps {
  type?: "personal" | "business"
  limit?: number
}

export function RecentTransactions({ type = "personal", limit = 5 }: RecentTransactionsProps) {
  const { transactions } = useTransactions()
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Filtrar por tipo de cuenta y ordenar por fecha (más reciente primero)
    const filtered = transactions
      .filter((t) => t.accountType === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)

    setRecentTransactions(filtered)
  }, [transactions, type, limit])

  if (recentTransactions.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No hay transacciones recientes. ¡Agrega una!</div>
  }

  return (
    <div className="space-y-8">
      {recentTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src="" alt="" />
            <AvatarFallback
              className={
                transaction.type === "ingreso"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
              }
            >
              {transaction.type === "ingreso" ? "+" : "-"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
          </div>
          <div className="ml-auto font-medium">
            <Badge
              variant="outline"
              className={
                transaction.type === "ingreso"
                  ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
                  : "text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-400"
              }
            >
              {transaction.type === "ingreso" ? "+" : "-"}${transaction.amount.toFixed(2)}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
