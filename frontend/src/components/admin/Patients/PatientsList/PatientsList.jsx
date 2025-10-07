import { Button } from "@/components/ui/button"
import { Eye, Edit, FileText, MoreVertical } from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import usePagination from "@/hooks/usePagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PatientsList({ patients, onView, onEdit, onViewVisits }) {
    const itemsPerPage = 5
    const {
        currentPage,
        totalPages,
        currentItemsRange,
        nextPage,
        prevPage
    } = usePagination({ totalItems: patients.length, itemsPerPage })

    if (patients.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No se encontraron pacientes</p>
            </div>
        )
    }

    const currentPatients = patients.slice(currentItemsRange.start - 1, currentItemsRange.end)

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {currentPatients.map((patient) => (
                    <div key={patient.id_user} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/20 gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-medium text-primary">
                                        {patient.first_name[0]}{patient.last_name[0]}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold truncate">{patient.first_name} {patient.last_name}</h3>
                                    <p className="text-sm text-muted-foreground truncate">
                                        DNI: {patient.dni} • {patient.email} • {patient.phone_number}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                            <Button variant="outline" size="sm" onClick={() => onView(patient)}>
                                <Eye className="w-4 h-4" />
                                <span className="sr-only sm:not-sr-only sm:ml-2">Ver</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onViewVisits(patient)}>
                                <FileText className="w-4 h-4" />
                                <span className="sr-only sm:not-sr-only sm:ml-2">Registros</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onEdit(patient)}>
                                <Edit className="w-4 h-4" />
                                <span className="sr-only sm:not-sr-only sm:ml-2">Editar</span>
                            </Button>
                        </div>

                        {/* Menú dropdown para mobile */}
                        <div className="sm:hidden flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onView(patient)}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onViewVisits(patient)}>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Registros
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEdit(patient)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t gap-4">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                        Mostrando {currentItemsRange.start}-{currentItemsRange.end} de {patients.length} pacientes
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="sr-only">Anterior</span>
                        </Button>
                        <span className="text-sm">Página {currentPage} de {totalPages}</span>
                        <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
                            <ChevronRight className="w-4 h-4" />
                            <span className="sr-only">Siguiente</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
