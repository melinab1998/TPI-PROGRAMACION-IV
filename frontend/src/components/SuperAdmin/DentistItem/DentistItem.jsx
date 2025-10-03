import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Edit, Trash2 } from "lucide-react"

export default function DentistItem({ dentist, index, onEdit, onToggleStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 hover:bg-muted/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-foreground">
                {dentist.first_name} {dentist.last_name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{dentist.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Matrícula: {dentist.license_number}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Creado: {dentist.created_at}
                </span>
                <Badge 
                  variant={dentist.status === "active" ? "default" : "secondary"}
                  className="text-sm px-3 py-1"
                >
                  {dentist.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(dentist)}
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(dentist)}
            className={`flex items-center gap-2 transition-all ${
              dentist.status === "active"
                ? "text-red-600 hover:bg-red-600 hover:text-white border-red-200"
                : "text-green-600 hover:bg-green-600 hover:text-white border-green-200"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {dentist.status === "active" ? "Desactivar" : "Activar"}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}