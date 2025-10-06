import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Header({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
    >
      <div className="space-y-2 mt-5">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-1">
          Super Administrador
        </h1>
        <p className="text-base text-muted-foreground">
          Gestión integral de dentistas del sistema
        </p>
      </div>
      <Button 
        onClick={onCreate}
        className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        size="default"
      >
        <Plus className="w-4 h-4" />
        Nuevo Dentista
      </Button>
    </motion.div>
  )
}
