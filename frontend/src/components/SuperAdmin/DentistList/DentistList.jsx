import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users } from "lucide-react"
import DentistItem from "../DentistItem/DentistItem"

export default function DentistList({ 
  dentists, 
  onEdit, 
  onToggleStatus, 
  searchTerm,
  currentPage,
  itemsPerPage 
}) {
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentDentists = dentists.slice(startIndex, startIndex + itemsPerPage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="border-2 border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">Dentistas ({dentists.length})</CardTitle>
          <CardDescription className="text-lg">
            Lista de todos los dentistas del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {currentDentists.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-4">
              <Users className="w-16 h-16 mx-auto opacity-50" />
              <p className="text-xl font-medium">
                {searchTerm ? "No se encontraron dentistas" : "No hay dentistas registrados"}
              </p>
              <p className="text-sm">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando un nuevo dentista"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {currentDentists.map((dentist, index) => (
                <DentistItem
                  key={dentist.id_user}
                  dentist={dentist}
                  index={index}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}