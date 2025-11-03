import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Clock, FileText, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function TurnCard({ turn, patientData, visitRecord, handleCreateVisitRecord, fadeSlideUp }) {
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Pending': return 'default';
            case 'Completed': return 'secondary';
            case 'Cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pending': return 'Pendiente';
            case 'Completed': return 'Completado';
            case 'Cancelled': return 'Cancelado';
            default: return status;
        }
    };

    const getConsultationTypeText = (type) => {
        switch (type) {
            case 'Consulta': return 'Consulta';
            case 'Tratamiento': return 'Tratamiento';
            default: return type;
        }
    };

    return (
        <motion.div variants={fadeSlideUp} className="p-4 hover:bg-muted/50 transition-colors rounded-md border-b">
            <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                            {patientData ? patientData.name : `Paciente ID: ${turn.patientId}`}
                        </h3>
                        {visitRecord && (
                            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                <FileText className="w-3 h-3 mr-1" /> Registrado
                            </Badge>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" /> 
                            <span>DNI: {patientData ? patientData.dni : 'Cargando...'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                                Hora: {new Date(turn.appointmentDate).toLocaleTimeString('es-ES', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant={getStatusBadgeVariant(turn.status)}>
                            {getStatusText(turn.status)}
                        </Badge>
                        
                        <Badge variant="outline">
                            {getConsultationTypeText(turn.consultationType)}
                        </Badge>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                    <Button
                        onClick={() => handleCreateVisitRecord(turn)}
                        variant={visitRecord ? "outline" : "default"}
                        size="sm"
                        className="whitespace-nowrap"
                        disabled={turn.status === 'Cancelled'}
                    >
                        {visitRecord ? (
                            <>
                                <FileText className="w-4 h-4 mr-2" /> Ver/Editar
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" /> Crear Registro
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}