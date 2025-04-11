"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Transaction } from "@/types"
import { v4 as uuidv4 } from "uuid"

// Datos de ejemplo para tener algo que mostrar inicialmente
const sampleTransactions: Transaction[] = [
  {
    id: uuidv4(),
    description: "Salario mensual",
    amount: 2500,
    type: "ingreso",
    category: "Salario",
    date: "2023-07-01",
    accountType: "personal",
    timestamp: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    description: "Supermercado",
    amount: 120.5,
    type: "egreso",
    category: "Alimentación",
    date: "2023-07-05",
    accountType: "personal",
    timestamp: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    description: "Pago de alquiler",
    amount: 800,
    type: "egreso",
    category: "Vivienda",
    date: "2023-07-10",
    accountType: "personal",
    timestamp: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    description: "Trabajo freelance",
    amount: 350,
    type: "ingreso",
    category: "Freelance",
    date: "2023-07-15",
    accountType: "personal",
    timestamp: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    description: "Venta de servicios",
    amount: 5000,
    type: "ingreso",
    category: "Ventas",
    date: "2023-07-01",
    accountType: "business",
    timestamp: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    description: "Compra de materiales",
    amount: 1200,
    type: "egreso",
    category: "Suministros",
    date: "2023-07-08",
    accountType: "business",
    timestamp: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    description: "Pago de impuestos",
    amount: 800,
    type: "egreso",
    category: "Impuestos",
    date: "2023-07-15",
    accountType: "business",
    timestamp: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    description: "Proyecto completado",
    amount: 3500,
    type: "ingreso",
    category: "Servicios",
    date: "2023-07-20",
    accountType: "business",
    timestamp: new Date().toISOString(),
  },
]

type TransactionContextType = {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Cargar transacciones del localStorage al iniciar
    const storedTransactions = localStorage.getItem("transactions")
    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions))
      } catch (error) {
        console.error("Error parsing stored transactions:", error)
        // Si hay un error, usar los datos de ejemplo
        setTransactions(sampleTransactions)
        localStorage.setItem("transactions", JSON.stringify(sampleTransactions))
      }
    } else {
      // Si no hay datos guardados, usar los datos de ejemplo
      setTransactions(sampleTransactions)
      localStorage.setItem("transactions", JSON.stringify(sampleTransactions))
    }
  }, [])

  // Guardar transacciones en localStorage cuando cambien
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction])
  }

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((transaction) => (transaction.id === updatedTransaction.id ? updatedTransaction : transaction)),
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}
