"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp, Briefcase, Building, AlertCircle } from "lucide-react"
import { useTransactions } from "@/context/transaction-context"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export function InvestmentSuggestions() {
  const { transactions } = useTransactions()
  const { toast } = useToast()
  const [investmentAmount, setInvestmentAmount] = useState(0)

  useEffect(() => {
    // Calcular el 10% de los ingresos personales
    const personalIncome = transactions
      .filter((t) => t.accountType === "personal" && t.type === "ingreso")
      .reduce((sum, t) => sum + t.amount, 0)

    setInvestmentAmount(personalIncome * 0.1)
  }, [transactions])

  const investments = [
    {
      id: 1,
      name: "Cocos Capital - Fondo Diversificado",
      type: "Fondo de inversión",
      risk: "Moderado",
      return: "8-12% anual",
      description: "Fondo diversificado con exposición a renta fija y variable.",
      recommendation: "Alta",
      allocation: 0.5, // 50% del monto de inversión
      icon: <TrendingUp className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />,
    },
    {
      id: 2,
      name: "Cocos Capital - Renta Fija",
      type: "Bonos corporativos",
      risk: "Bajo",
      return: "5-7% anual",
      description: "Inversión en bonos corporativos de alta calidad crediticia.",
      recommendation: "Media",
      allocation: 0.3, // 30% del monto de inversión
      icon: <Building className="h-10 w-10 text-blue-500 dark:text-blue-400" />,
    },
    {
      id: 3,
      name: "Cocos Capital - Crecimiento",
      type: "Renta variable",
      risk: "Alto",
      return: "12-18% anual",
      description: "Inversión en empresas de alto crecimiento y tecnología.",
      recommendation: "Media",
      allocation: 0.2, // 20% del monto de inversión
      icon: <Briefcase className="h-10 w-10 text-purple-500 dark:text-purple-400" />,
    },
  ]

  const handleInvestClick = (investment: any) => {
    const amount = investmentAmount * investment.allocation

    toast({
      title: "Inversión simulada",
      description: `Has invertido ${formatCurrency(amount)} en ${investment.name}`,
      variant: "default",
    })
  }

  if (investmentAmount <= 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No hay fondos para invertir</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Registra ingresos personales para recibir recomendaciones de inversión.
        </p>
        <Button asChild>
          <Link href="/add-transaction">Agregar ingreso</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {investments.map((investment) => {
        const amount = investmentAmount * investment.allocation

        return (
          <Card key={investment.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                {investment.icon}
                <Badge
                  variant="outline"
                  className={
                    investment.recommendation === "Alta"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
                      : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400"
                  }
                >
                  {investment.recommendation === "Alta" ? "Recomendado" : "Opción"}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">{investment.name}</CardTitle>
              <CardDescription>{investment.type}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Riesgo</p>
                  <p className="font-medium">{investment.risk}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Retorno esperado</p>
                  <p className="font-medium">{investment.return}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">{investment.description}</p>
                <p className="text-sm font-medium mt-2">
                  Monto sugerido: <span className="text-primary">{formatCurrency(amount)}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {(investment.allocation * 100).toFixed(0)}% de tu presupuesto de inversión
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => handleInvestClick(investment)}>
                <span>Invertir ahora</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
