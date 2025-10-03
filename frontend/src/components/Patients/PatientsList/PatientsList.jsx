import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Edit, FileText, Stethoscope } from "lucide-react"
import Pagination from "@/components/Pagination/Pagination"

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

    const currentItemsCount = {
        start: startIndex + 1,
        end: Math.min(startIndex + patientsPerPage, patients.length)
    }

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

            {/* Usas el mismo componente Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={patients.length}
                itemsPerPage={patientsPerPage}
                currentItemsCount={currentItemsCount}
                itemsName="pacientes" // Puedes hacerlo más flexible agregando esta prop
            />
        </div>
    )
}