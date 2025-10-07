import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Clock, FileText, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function TurnCard({ turn, visitRecord, handleCreateVisitRecord, fadeSlideUp }) {
    return (
        <motion.div variants={fadeSlideUp} className="p-4 hover:bg-muted/50 transition-colors rounded-md">
            <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{turn.patient_name}</h3>
                        {visitRecord && (
                            <Badge variant="default" className="bg-primary/10 text-primary">
                                <FileText className="w-3 h-3 mr-1" /> Registrado
                            </Badge>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /> <span>DNI: {turn.patient_dni}</span></div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>Hora: {turn.scheduled_time}</span></div>
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <Button
                        onClick={() => handleCreateVisitRecord(turn)}
                        variant={visitRecord ? "outline" : "default"}
                        size="sm"
                        className="whitespace-nowrap"
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
