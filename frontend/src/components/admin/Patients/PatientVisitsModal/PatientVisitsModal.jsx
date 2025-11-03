import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import PatientOdontogramModal from "../PatientOdontogramModal/PatientOdontogramModal"

export default function PatientVisitsModal({ open, onClose, patient }) {
    const [isOdontogramOpen, setIsOdontogramOpen] = useState(false)

    if (!patient) return null

    const patientVisits = mockVisitRecords

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Registros de Visitas - {patient.firstName} {patient.lastName}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-end mb-4 gap-2">
                        <Button
                            size="sm"
                            onClick={() => setIsOdontogramOpen(true)}
                            variant="outline"
                        >
                            Ver Odontograma
                        </Button>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4">
                        {patientVisits.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No hay registros de visita para este paciente</p>
                            </div>
                        ) : (
                            patientVisits.map((visit) => (
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
                            ))
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t flex-shrink-0">
                        <Button variant="outline" onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <PatientOdontogramModal
                open={isOdontogramOpen}
                onClose={() => setIsOdontogramOpen(false)}
                patient={patient}
            />
        </>
    )
}
