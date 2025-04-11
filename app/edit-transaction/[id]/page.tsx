"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save } from "lucide-react"
import { useTransactions } from "@/context/transaction-context"
import { useToast } from "@/components/ui/use-toast"
import type { Transaction } from "@/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function EditTransactionPage() {
  const params = useParams()
  const router = useRouter()
  const { transactions, updateTransaction } = useTransactions()
  const { toast } = useToast()

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [accountType, setAccountType] = useState<"personal" | "business">("personal")
  const [transactionType, setTransactionType] = useState<"ingreso" | "egreso">("ingreso")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  const personalCategories = [
    { value: "Salario", label: "Salario" },
    { value: "Freelance", label: "Freelance" },
    { value: "Inversiones", label: "Inversiones" },
    { value: "Regalos", label: "Regalos" },
    { value: "Alimentación", label: "Alimentación" },
    { value: "Transporte", label: "Transporte" },
    { value: "Vivienda", label: "Vivienda" },
    { value: "Servicios", label: "Servicios" },
    { value: "Salud", label: "Salud" },
    { value: "Educación", label: "Educación" },
    { value: "Entretenimiento", label: "Entretenimiento" },
    { value: "Ropa", label: "Ropa" },
    { value: "Viajes", label: "Viajes" },
    { value: "Otros", label: "Otros" },
  ]

  const businessCategories = [
    { value: "Ventas", label: "Ventas" },
    { value: "Servicios", label: "Servicios" },
    { value: "Inversiones", label: "Inversiones" },
    { value: "Suministros", label: "Suministros" },
    { value: "Salarios", label: "Salarios" },
    { value: "Marketing", label: "Marketing" },
    { value: "Tecnología", label: "Tecnología" },
    { value: "Alquiler", label: "Alquiler" },
    { value: "Impuestos", label: "Impuestos" },
    { value: "Seguros", label: "Seguros" },
    { value: "Viajes", label: "Viajes" },
    { value: "Comisiones", label: "Comisiones" },
    { value: "Otros", label: "Otros" },
  ]

  // Cargar la transacción
  useEffect(() => {
    if (params.id) {
      const foundTransaction = transactions.find((t) => t.id === params.id)

      if (foundTransaction) {
        setTransaction(foundTransaction)
        setAccountType(foundTransaction.accountType)
        setTransactionType(foundTransaction.type)
        setAmount(foundTransaction.amount.toString())
        setDescription(foundTransaction.description)
        setCategory(foundTransaction.category)
        setNotes(foundTransaction.notes || "")
        setDate(new Date(foundTransaction.date))
      } else {
        toast({
          title: "Error",
          description: "Transacción no encontrada",
          variant: "destructive",
        })
        router.push("/")
      }
    }
    setIsLoading(false)
  }, [params.id, transactions, router, toast])

  const categories = accountType === "personal" ? personalCategories : businessCategories

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!description.trim()) {
      newErrors.description = "La descripción es obligatoria"
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Ingresa un monto válido mayor a 0"
    }

    if (!category) {
      newErrors.category = "Selecciona una categoría"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !transaction) {
      return
    }

    const updatedTransaction: Transaction = {
      ...transaction,
      description,
      amount: Number.parseFloat(amount),
      type: transactionType,
      category,
      notes,
      date: date.toISOString().split("T")[0],
      accountType,
    }

    updateTransaction(updatedTransaction)

    toast({
      title: "Transacción actualizada",
      description: "La transacción ha sido actualizada correctamente.",
      variant: "default",
    })

    router.push(`/transactions/${accountType}`)
  }

  if (isLoading) {
    return (
      <div className="container py-6 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando transacción...</p>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Transacción no encontrada</h2>
          <p className="text-muted-foreground mt-2">La transacción que buscas no existe o ha sido eliminada.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Editar Transacción</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Editar Transacción</CardTitle>
            <CardDescription>Modifica los detalles de la transacción.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={accountType} onValueChange={(value) => setAccountType(value as "personal" | "business")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="business">Empresarial</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div>
                <Label htmlFor="transaction-type">Tipo de Transacción</Label>
                <RadioGroup
                  value={transactionType}
                  onValueChange={(value) => setTransactionType(value as "ingreso" | "egreso")}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ingreso" id="ingreso" />
                    <Label htmlFor="ingreso" className="font-normal">
                      Ingreso
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="egreso" id="egreso" />
                    <Label htmlFor="egreso" className="font-normal">
                      Egreso
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className={errors.amount ? "text-destructive" : ""}>
                    Monto
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className={`pl-7 ${errors.amount ? "border-destructive" : ""}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.01"
                      min="0.01"
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                        {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                  Descripción
                </Label>
                <Input
                  id="description"
                  placeholder="Descripción de la transacción"
                  className={errors.description ? "border-destructive" : ""}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className={errors.category ? "text-destructive" : ""}>
                  Categoría
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas adicionales</Label>
                <Textarea
                  id="notes"
                  placeholder="Notas o detalles adicionales (opcional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
