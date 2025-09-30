import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

const mockVisitRecords = [
    {
        id_visit_record: 1,
        visit_date: "2024-01-15T10:00:00Z",
        treatment: "Limpieza dental completa y fluoración",
        diagnosis: "Gingivitis leve, cálculo dental moderado",
        notes: "Paciente con buena higiene bucal general, necesita mejorar técnica de cepillado en molares",
        prescription: "Enjuague bucal con clorhexidina 0.12% 2 veces al día por 7 días. Cepillo interdental para limpieza de espacios.",
        id_turn: 1
    },
    {
        id_visit_record: 2,
        visit_date: "2024-02-20T11:30:00Z",
        treatment: "Control y revisión de evolución. Aplicación de sellantes en primeros molares.",
        diagnosis: "Mejoría significativa de gingivitis. Sellantes preventivos indicados.",
        notes: "Paciente mostró mejoría en técnica de cepillado. Recomendado control en 6 meses.",
        prescription: "Continuar con enjuague bucal 1 vez al día por 30 días. Control en 6 meses.",
        id_turn: 5
    }
]

function VisitHistory({ patient }) {
    const patientVisits = mockVisitRecords 

    if (patientVisits.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay registros de visita para este paciente</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-background pb-2 pt-1">
                <h3 className="font-semibold text-lg">Historial de Visitas</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>{patientVisits.length} visitas registradas</span>
                </div>
            </div>

            <div className="space-y-4 pb-2">
                {patientVisits.map((visit) => (
                    <div key={visit.id_visit_record} className="border rounded-lg p-4 space-y-3 bg-card hover:bg-accent/5 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {format(parseISO(visit.visit_date), "dd/MM/yyyy", { locale: es })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {format(parseISO(visit.visit_date), "HH:mm", { locale: es })}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-3 text-sm">
                            <div>
                                <span className="font-medium text-muted-foreground block mb-1">Tratamiento:</span>
                                <p className="text-foreground pl-2 border-l-2 border-primary/20">{visit.treatment}</p>
                            </div>

                            <div>
                                <span className="font-medium text-muted-foreground block mb-1">Diagnóstico:</span>
                                <p className="text-foreground pl-2 border-l-2 border-primary/20">{visit.diagnosis}</p>
                            </div>

                            {visit.notes && (
                                <div>
                                    <span className="font-medium text-muted-foreground block mb-1">Notas:</span>
                                    <p className="text-foreground pl-2 border-l-2 border-primary/20">{visit.notes}</p>
                                </div>
                            )}

                            {visit.prescription && (
                                <div>
                                    <span className="font-medium text-muted-foreground block mb-1">Prescripción:</span>
                                    <p className="text-foreground pl-2 border-l-2 border-primary/20">{visit.prescription}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function PatientVisitsModal({ open, onClose, patient }) {
    if (!patient) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Registros de Visitas - {patient.first_name} {patient.last_name}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0">
                    <VisitHistory patient={patient} />
                </div>

                <div className="flex justify-end pt-4 border-t flex-shrink-0">
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}