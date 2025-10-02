import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Edit, ChevronLeft, ChevronRight, FileText, Tooth } from "lucide-react"

export default function PatientsList({ patients, onView, onEdit, onViewVisits, onViewOdontogram }) {
    const [currentPage, setCurrentPage] = useState(1)
    const patientsPerPage = 5

    if (patients.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No se encontraron pacientes</p>
            </div>
        )
    }

    const totalPages = Math.ceil(patients.length / patientsPerPage)
    const startIndex = (currentPage - 1) * patientsPerPage
    const currentPatients = patients.slice(startIndex, startIndex + patientsPerPage)

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {currentPatients.map((patient) => (
                    <div key={patient.id_user} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary">
                                        {patient.first_name[0]}{patient.last_name[0]}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {patient.first_name} {patient.last_name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        DNI: {patient.dni} • {patient.email} • {patient.phone_number}
                                    </p>
                                    {patient.health_plan && (
                                        <p className="text-xs text-muted-foreground">
                                            {patient.health_plan.health_insurance.name} - {patient.health_plan.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onView(patient)}
                                className="flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                Ver
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewOdontogram(patient)}
                                className="flex items-center gap-2"
                                title="Ver odontograma (solo lectura)"
                            >
                                <Tooth className="w-4 h-4" />
                                Odontograma
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewVisits(patient)}
                                className="flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                Registros
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(patient)}
                                className="flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Mostrando {startIndex + 1}-{Math.min(startIndex + patientsPerPage, patients.length)} de {patients.length} pacientes
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}