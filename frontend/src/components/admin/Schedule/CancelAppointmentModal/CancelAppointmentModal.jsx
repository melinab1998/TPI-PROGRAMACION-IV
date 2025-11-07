import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar, User, Clock } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { useContext } from "react"
import { successToast, errorToast } from "@/utils/notifications"
import { cancelTurn } from "@/services/api.services"
import { AuthContext } from "@/services/auth/AuthContextProvider"

export default function CancelAppointmentModal({
    open,
    onClose,
    appointment,
    onCancelled 
}) {
    const { token } = useContext(AuthContext); 

    if (!appointment) return null

    const appointmentDate = parseISO(appointment.appointment_date)
    const formattedDate = format(appointmentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
    const formattedTime = format(appointmentDate, "HH:mm")

    const handleConfirm = async () => {
        if (!token) {
            errorToast("No hay token disponible")
            return
        }

        // 🔹 Verificar también el ID del turno
        const turnId = appointment.id_turn || appointment.id;
        if (!turnId) {
            errorToast("No se pudo identificar el turno a cancelar");
            return;
        }

        console.log("🔍 Cancelando turno ID:", turnId, "Token:", !!token);

        cancelTurn(
            token,
            turnId, // ✅ Usar la variable verificada
            () => {
                successToast("Turno cancelado exitosamente")
                onCancelled(turnId) // ✅ Usar el mismo ID
                onClose()
            },
            (err) => {
                console.error("Error al cancelar turno:", err)
                errorToast(err.message || "No se pudo cancelar el turno")
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        <DialogTitle className="text-destructive">Cancelar Turno</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        ¿Está seguro que desea cancelar el siguiente turno?
                    </p>

                    <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="font-medium">{appointment.patient_name}</div>
                                <div className="text-sm text-muted-foreground">
                                    DNI: {appointment.patient_dni}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                                {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">{formattedTime} hs</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                            </div>
                            <div className="text-sm">
                                <span className="text-muted-foreground">Tipo: </span>
                                {appointment.consultation_type}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                            </div>
                            <div className="text-sm">
                                <span className="text-muted-foreground">Dentista: </span>
                                {appointment.dentist_name}
                            </div>
                        </div>
                    </div>

                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                        <p className="text-sm text-destructive text-center">
                            ⚠️ Esta acción no se puede deshacer
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Mantener Turno
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        className="flex-1"
                    >
                        Sí, Cancelar Turno
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}