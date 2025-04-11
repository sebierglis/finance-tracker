"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/context/auth-context"
import { BarChart3, CreditCard, Home, PiggyBank, Settings, TrendingUp } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Transacciones", href: "/transactions/personal", icon: CreditCard },
    { name: "Inversiones", href: "/investments", icon: TrendingUp },
    { name: "Reportes", href: "/reports", icon: BarChart3 },
    { name: "Configuración", href: "/settings", icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <PiggyBank className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Finance Erglis</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center text-sm font-medium ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <UserNav />
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
