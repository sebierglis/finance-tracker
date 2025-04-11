import Link from "next/link"
import { ArrowRight, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { InvestmentSuggestions } from "@/components/investment-suggestions"
import { FinancialSummary } from "@/components/financial-summary"

export default function Home() {
  return (
    <div className="container relative py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Gestiona tus finanzas personales y empresariales en un solo lugar.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/reports">Descargar Reporte</Link>
          </Button>
          <Button asChild>
            <Link href="/add-transaction">
              <PiggyBank className="mr-2 h-4 w-4" />
              Nueva Transacción
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="mt-6 space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Finanzas Personales</TabsTrigger>
          <TabsTrigger value="business">Finanzas Empresariales</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <FinancialSummary type="personal" />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Transacciones Recientes</CardTitle>
                <CardDescription>Últimas transacciones personales.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/transactions/personal" className="flex items-center justify-center w-full">
                    Ver todas las transacciones
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sugerencias de Inversión</CardTitle>
              <CardDescription>Basado en tu perfil financiero y estadísticas actuales.</CardDescription>
            </CardHeader>
            <CardContent>
              <InvestmentSuggestions />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <FinancialSummary type="business" />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview type="business" />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Transacciones Recientes</CardTitle>
                <CardDescription>Últimas transacciones empresariales.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions type="business" />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/transactions/business" className="flex items-center justify-center w-full">
                    Ver todas las transacciones
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
