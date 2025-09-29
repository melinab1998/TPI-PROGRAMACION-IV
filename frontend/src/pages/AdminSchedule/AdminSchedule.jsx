import { useState } from "react"
import { parseISO, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/AdminSchedule/Header/Header"
import Calendar from "@/components/AdminSchedule/Calendar/Calendar"
import DaySummary from "@/components/AdminSchedule/DaySummary/DaySummary"
import AppointmentList from "@/components/AdminSchedule/AppointmentList/AppointmentList"

const initialAppointments = [ 
    { id_turn: 101, appointment_date: "2025-09-30T09:00:00", status: "Activo", consultation_type: "Consulta", patient_name: "María López", patient_email: "maria@email.com", patient_dni: "41239736" }, 
    { id_turn: 102, appointment_date: "2025-09-30T10:00:00", status: "Activo", consultation_type: "Tratamiento", patient_name: "Juan Pérez", patient_email: "juan@email.com", patient_dni: "41239736" }, 
    { id_turn: 103, appointment_date: "2025-09-30T11:30:00", status: "Cancelado", consultation_type: "Tratamiento", patient_name: "Ana Gómez", patient_email: "ana@email.com", patient_dni: "41239736" }, 
    { id_turn: 111, appointment_date: "2025-09-30T10:00:00", status: "Activo", consultation_type: "Tratamiento", patient_name: "Juan Pérez", patient_email: "juan@email.com", patient_dni: "41239736" }, 
    { id_turn: 104, appointment_date: "2025-10-01T15:00:00", status: "Activo", consultation_type: "Consulta", patient_name: "Pedro Ruiz", patient_email: "pedro@email.com", patient_dni: "41239736" }, 
    { id_turn: 105, appointment_date: "2025-10-02T14:00:00", status: "Activo", consultation_type: "Consulta", patient_name: "Carlos Mendoza", patient_email: "carlos@email.com", patient_dni: "41239736" }, 
];

export default function AdminSchedule() {
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [appointments, setAppointments] = useState(initialAppointments)
    const [filters, setFilters] = useState({ patient: "", status: "Todos" })

    const handleCancel = (id) => {
        if (confirm(`¿Está seguro de cancelar el turno ${id}?`)) {
            setAppointments(prev => prev.map(a =>
                a.id_turn === id ? { ...a, status: "Cancelado" } : a
            ))
        }
    }

    const handleEdit = (id) => alert(`Editar turno ${id}`)
    const handleCreate = () => alert("Crear nuevo turno")

    const filteredAppointments = appointments.filter(a => {
        const appointmentDate = parseISO(a.appointment_date)
        if (!isSameDay(appointmentDate, selectedDate)) return false
        if (!a.patient_name.toLowerCase().includes(filters.patient.toLowerCase())) return false
        if (filters.status !== "Todos" && a.status !== filters.status) return false
        return true
    })

    const appointmentsForSelectedDay = appointments.filter(a =>
        isSameDay(parseISO(a.appointment_date), selectedDate)
    )

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <Header onCreate={handleCreate} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendario - MISMA ALTURA */}
                <Card className="h-[650px] flex flex-col"> {/* Aumenté la altura */}
                    <CardHeader className="flex-shrink-0">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            Calendario de Turnos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 p-6 flex flex-col">
                        <div className="flex-1 min-h-0">
                            <Calendar
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                                appointments={appointments}
                            />
                        </div>
                        <div className="flex-shrink-0 pt-4 mt-4 border-t">
                            <DaySummary
                                selectedDate={selectedDate}
                                count={appointmentsForSelectedDay.length}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Turnos - MISMA ALTURA */}
                <AppointmentList
                    appointments={appointments}
                    filteredAppointments={filteredAppointments}
                    appointmentsForSelectedDay={appointmentsForSelectedDay}
                    filters={filters}
                    setFilters={setFilters}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}