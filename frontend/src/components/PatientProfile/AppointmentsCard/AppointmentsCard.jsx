import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AppointmentsCard({ appointments }) {
    return (
        <Card className="border-border shadow-md">
            <CardHeader>
                <CardTitle className="text-xl text-foreground">Historial de Turnos</CardTitle>
                <CardDescription>Tus consultas anteriores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {appointments.length ? appointments.map((appointment) => (
                    <div key={appointment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border rounded-lg p-4 hover:bg-muted/30 transition-colors border-border">
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{appointment.dentist}</h3>
                            <p className="text-muted-foreground mt-1">{appointment.treatment}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{appointment.date}</span>
                            <span className="text-sm text-muted-foreground mt-2">{appointment.time}</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-muted-foreground space-y-3">
                        <p className="text-lg font-medium">No hay turnos anteriores para mostrar.</p>
                        <p className="text-sm">Cuando reserves una cita, aparecerá aquí tu historial.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
