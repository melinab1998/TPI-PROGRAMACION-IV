import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AppointmentsCard({ appointments }) {
    const hasManyAppointments = appointments.length > 4;
    const displayAppointments = hasManyAppointments ? appointments.slice(0, 4) : appointments;

    return (
        <Card className="border-border shadow-md">
            <CardHeader>
                <CardTitle className="text-xl text-foreground">Historial de Turnos</CardTitle>
                <CardDescription>Tus consultas anteriores</CardDescription>
            </CardHeader>
            <CardContent className={hasManyAppointments ? "p-0" : "space-y-4"}>
                {appointments.length ? (
                    <div className={hasManyAppointments ? "h-80" : ""}>
                        <ScrollArea className={hasManyAppointments ? "h-full px-6" : ""}>
                            <div className={hasManyAppointments ? "space-y-4 py-4" : "space-y-4"}>
                                {displayAppointments.map((appointment) => (
                                    <div 
                                        key={appointment.id} 
                                        className="flex items-start gap-4 border rounded-lg p-4 hover:bg-muted/30 transition-colors border-border group"
                                    >
                                        {/* Icono del doctor */}
                                        <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                strokeWidth="1.5" 
                                                className="w-5 h-5 text-primary"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" 
                                                />
                                            </svg>
                                        </div>
                                        
                                        {/* Información principal */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground text-lg mb-1">
                                                {appointment.dentist}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                                    </svg>
                                                    {appointment.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                    {appointment.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground space-y-3">
                        <p className="text-lg font-medium">No hay turnos anteriores para mostrar.</p>
                        <p className="text-sm">Cuando reserves una cita, aparecerá aquí tu historial.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}