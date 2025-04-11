"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Filter, Plus, Search, Trash2, Edit, ArrowUpDown, Calendar } from "lucide-react"
import { useTransactions } from "@/context/transaction-context"
import type { Transaction } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function TransactionsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const type = params.type as string
  const isPersonal = type === "personal"

  const { transactions, deleteTransaction } = useTransactions()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<string[]>([])

  // Filtrar transacciones
  useEffect(() => {
    // Primero filtramos por tipo de cuenta
    let filtered = transactions.filter((t) => t.accountType === type)

    // Extraer categorías únicas para el filtro
    const uniqueCategories = Array.from(new Set(filtered.map((t) => t.category)))
    setCategories(uniqueCategories)

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por tipo de transacción
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    // Filtrar por categoría
    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory)
    }

    // Filtrar por rango de fechas
    if (dateRange.from) {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate >= dateRange.from!
      })
    }

    if (dateRange.to) {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate <= dateRange.to!
      })
    }

    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === "amount-desc") {
        return b.amount - a.amount
      } else if (sortBy === "amount-asc") {
        return a.amount - b.amount
      } else if (sortBy === "description-asc") {
        return a.description.localeCompare(b.description)
      } else if (sortBy === "description-desc") {
        return b.description.localeCompare(a.description)
      }
      return 0
    })

    setFilteredTransactions(filtered)
  }, [transactions, type, searchTerm, filterType, filterCategory, sortBy, dateRange])

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id)
    toast({
      title: "Transacción eliminada",
      description: "La transacción ha sido eliminada correctamente.",
      variant: "default",
    })
  }

  const handleExport = () => {
    // Crear CSV
    const headers = ["Fecha", "Descripción", "Categoría", "Tipo", "Monto"]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) => [t.date, `"${t.description}"`, `"${t.category}"`, t.type, t.amount].join(",")),
    ].join("\n")

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `transacciones_${type}_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportación completada",
      description: "Las transacciones han sido exportadas a CSV.",
      variant: "default",
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterCategory("all")
    setDateRange({ from: undefined, to: undefined })
    setSortBy("date-desc")
  }

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Transacciones {isPersonal ? "Personales" : "Empresariales"}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Todas las transacciones</CardTitle>
              <CardDescription>
                Visualiza y gestiona todas tus transacciones {isPersonal ? "personales" : "empresariales"}.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild>
                <Link href="/add-transaction">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Transacción
                </Link>
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transacciones..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ingreso">Ingresos</SelectItem>
                    <SelectItem value="egreso">Egresos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[250px] justify-start text-left font-normal">
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        "Seleccionar rango de fechas"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      locale={es}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Fecha (más reciente)</SelectItem>
                    <SelectItem value="date-asc">Fecha (más antigua)</SelectItem>
                    <SelectItem value="amount-desc">Monto (mayor a menor)</SelectItem>
                    <SelectItem value="amount-asc">Monto (menor a mayor)</SelectItem>
                    <SelectItem value="description-asc">Descripción (A-Z)</SelectItem>
                    <SelectItem value="description-desc">Descripción (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.notes && (
                          <div className="text-xs text-muted-foreground mt-1">{transaction.notes}</div>
                        )}
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            transaction.type === "ingreso"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-400"
                          }
                        >
                          {transaction.type === "ingreso" ? "Ingreso" : "Egreso"}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          transaction.type === "ingreso"
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-rose-600 dark:text-rose-500"
                        }`}
                      >
                        {transaction.type === "ingreso" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/edit-transaction/${transaction.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la transacción.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No se encontraron transacciones
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
