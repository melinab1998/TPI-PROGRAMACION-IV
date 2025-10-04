import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toastHelper } from "@/utils/notifications";

export default function NextAppointmentCard({ appointment }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!appointment) {
        return (
            <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-background to-muted/10 overflow-hidden relative text-center py-8">
                <CardContent className="space-y-6 p-6">
                    <div className="bg-muted/50 p-4 rounded-full inline-flex border border-border/30 group-hover:scale-105 transition-transform duration-300">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-lg font-medium">
                            No tienes turnos programados
                        </p>
                        <p className="text-muted-foreground/70 text-sm mt-2">
                            Reserva tu primera cita con nuestros especialistas
                        </p>
                    </div>
                    <Button
                        asChild
                        size="lg"
                        className="mt-2 bg-primary hover:bg-primary/90 text-base px-6 py-5 rounded-lg"
                    >
                        <Link to="/appointments" className="flex items-center justify-center">
                            Reservar mi primer turno
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const handleCancelAppointment = () => {
        // Aquí iría la lógica para cancelar el turno en el backend
        console.log("Turno cancelado:", appointment);
        
        // Mostrar toast de éxito
        toastHelper.success("Turno cancelado correctamente");
        
        // Cerrar el modal
        setIsModalOpen(false);
    };

    return (
        <>
            <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-background to-muted/10 overflow-hidden relative">
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-full group-hover:scale-105 transition-transform duration-300 shadow-md shrink-0">
                        <Calendar className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-3">
                        <div>
                            <p className="font-semibold text-xl text-foreground">{appointment.date}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="inline-flex items-center px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                {appointment.time}
                            </span>
                            <span className="inline-flex items-center px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                                <User className="h-3.5 w-3.5 mr-1.5" />
                                {appointment.dentist}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-9 gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 rounded-md transition-all duration-200 text-sm w-full md:w-28"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <X className="h-4 w-4" />
                            <span>Cancelar</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-background p-6 rounded-lg shadow-lg w-80 space-y-5 border border-border">
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                                <X className="h-6 w-6 text-destructive" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">¿Cancelar turno?</h3>
                            <p className="text-muted-foreground text-sm">
                                Esta acción no se puede deshacer
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Conservar
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={handleCancelAppointment}
                            >
                                Sí, cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}