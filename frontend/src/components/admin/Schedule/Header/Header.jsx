import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header({ onCreate }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-4 mb-1">
          Agenda de Turnos
        </h1>
        <p className="text-base text-muted-foreground">
          Gestiona y visualiza todos los turnos programados
        </p>
      </div>
      <Button onClick={onCreate} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Nuevo Turno
      </Button>
    </div>
  )
}
