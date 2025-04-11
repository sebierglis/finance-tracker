export interface Transaction {
  id: string
  description: string
  amount: number
  type: "ingreso" | "egreso"
  category: string
  date: string
  accountType: "personal" | "business"
  timestamp: string
  notes?: string
}
