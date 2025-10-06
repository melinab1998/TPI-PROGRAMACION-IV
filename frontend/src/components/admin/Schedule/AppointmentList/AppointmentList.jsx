import { parseISO } from "date-fns"
import { CalendarDays } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AppointmentCard from "../AppointmentCard/AppointmentCard"
import Filters from "../Filters/Filters"

export default function AppointmentList({
    appointments,
    filteredAppointments,
    appointmentsForSelectedDay,
    filters,
    setFilters,
    onEdit,
    onCancel,
}) {
    return (
        <Card className="flex flex-col h-[650px]">
            <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="text-xl">Turnos del Día</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                    <p className="text-sm text-muted-foreground">{filteredAppointments.length} turno(s) encontrado(s)</p>
                    <Badge variant="outline">{filteredAppointments.length} de {appointmentsForSelectedDay.length}</Badge>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4 flex flex-col flex-1 min-h-0 p-0">
                <div className="px-6 pb-3 flex-shrink-0">
                    <Filters filters={filters} setFilters={setFilters} />
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                    {filteredAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {filteredAppointments
                                .sort((a, b) => parseISO(a.appointment_date) - parseISO(b.appointment_date))
                                .map((turno) => (
                                    <AppointmentCard
                                        key={turno.id_turn}
                                        turno={turno}
                                        onEdit={onEdit}
                                        onCancel={onCancel}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground h-full flex items-center justify-center">
                            <div>
                                <CalendarDays className="w-16 h-16 mx-auto mb-3 opacity-50" />
                                <p className="text-base">No hay turnos para esta fecha</p>
                                {appointmentsForSelectedDay.length > 0 && filters.patient && (
                                    <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}