import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function NextAppointmentCard({ appointment }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!appointment) {
        return (
            <Card className="shadow-lg text-center py-12 border-border/50 bg-gradient-to-br from-background to-muted/30 relative">
                <CardContent className="space-y-6">
                    <div className="bg-muted/50 p-5 rounded-full inline-flex border border-border/30">
                        <Calendar className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-lg">No tienes turnos programados</p>
                        <p className="text-muted-foreground/70 text-sm mt-1">
                            Reserva tu primera cita con nuestros especialistas
                        </p>
                    </div>
                    <Button asChild size="lg" className="mt-2 gap-2 bg-primary hover:bg-primary/90">
                        <Link to="/appointments" className="flex items-center">
                            <span>Sacar mi primer turno</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/3 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                <CardContent className="p-8 relative flex flex-col md:flex-row items-center gap-8 z-10">
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-5 rounded-full shrink-0 shadow-md">
                        <Calendar className="h-10 w-10 text-white" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <p className="font-bold text-2xl text-foreground">{appointment.date}</p>
                        <p className="text-muted-foreground mt-2">{appointment.treatment}</p>

                        <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                            <span className="inline-flex items-center px-4 py-2 text-sm rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                                <Clock className="h-4 w-4 mr-2" /> {appointment.time}
                            </span>
                            <span className="inline-flex items-center px-4 py-2 text-sm rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                                <User className="h-4 w-4 mr-2" /> {appointment.dentist}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 p-5 shrink-0">
                        <Button
                            size="sm"
                            className="min-w-[120px] h-9 gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-all duration-200 group shadow-sm"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <span>Cancelar</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Modal de confirmación */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-background p-6 rounded-lg shadow-lg w-80 text-center space-y-4">
                        <p className="text-lg font-medium text-foreground">
                            ¿Seguro deseas cancelar el turno?
                        </p>
                        <div className="flex justify-between gap-4 mt-4">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsModalOpen(false)}
                            >
                                No
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                                onClick={() => {
                                    // Lógica de cancelación
                                    console.log("Turno cancelado");
                                    setIsModalOpen(false);
                                }}
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
