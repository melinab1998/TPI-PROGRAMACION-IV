import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, ChevronLeft, ChevronRight } from "lucide-react"
import DentistItem from "../DentistItem/DentistItem"
import usePagination from "@/hooks/usePagination"
import { Button } from "@/components/ui/button"

export default function DentistList({ dentists, onEdit, onToggleStatus, searchTerm }) {
  const itemsPerPage = 5
  const {
    currentPage,
    totalPages,
    currentItemsRange,
    nextPage,
    prevPage
  } = usePagination({ totalItems: dentists.length, itemsPerPage })

  const currentDentists = dentists.slice(currentItemsRange.start - 1, currentItemsRange.end)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="border-2 border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Dentistas ({dentists.length})</CardTitle>
          <CardDescription className="text-base">
            Lista de todos los dentistas del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {currentDentists.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-4">
              <Users className="w-14 h-14 mx-auto opacity-50" />
              <p className="text-lg font-medium">
                {searchTerm ? "No se encontraron dentistas" : "No hay dentistas registrados"}
              </p>
              <p className="text-sm">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando un nuevo dentista"}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border/50">
                {currentDentists.map((dentist, index) => (
                  <DentistItem
                    key={dentist.id}
                    dentist={dentist}
                    index={index}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="p-6 flex items-center justify-between border-t">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {currentItemsRange.start}-{currentItemsRange.end} de {dentists.length} dentistas
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm">Página {currentPage} de {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
