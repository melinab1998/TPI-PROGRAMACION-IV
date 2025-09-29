import { useState } from "react"
import { parseISO, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/AdminSchedule/Header/Header"
import Calendar from "@/components/AdminSchedule/Calendar/Calendar"
import DaySummary from "@/components/AdminSchedule/DaySummary/DaySummary"
import AppointmentList from "@/components/AdminSchedule/AppointmentList/AppointmentList"
import AppointmentFormModal from "@/components/AdminSchedule/AppointmentFormModal/AppointmentFormModal"

const initialAppointments = [ 
    { id_turn: 101, appointment_date: "2025-09-30T09:00", status: "Activo", consultation_type: "Consulta", patient_name: "María López", patient_email: "maria@email.com", patient_dni: "41239736", dentist_name: "Dr. Suárez" }, 
    { id_turn: 102, appointment_date: "2025-09-30T10:00", status: "Activo", consultation_type: "Tratamiento", patient_name: "Juan Pérez", patient_email: "juan@email.com", patient_dni: "41239736", dentist_name: "Dr. Suárez" }
]

export default function AdminSchedule() {
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [appointments, setAppointments] = useState(initialAppointments)
    const [filters, setFilters] = useState({ patient: "", status: "Todos" })

    // Modal control
    const [modalOpen, setModalOpen] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState(null)

    const handleCancel = (id) => {
        if (confirm(`¿Está seguro de cancelar el turno ${id}?`)) {
            setAppointments(prev => prev.map(a =>
                a.id_turn === id ? { ...a, status: "Cancelado" } : a
            ))
        }
    }

    const handleEdit = (id) => {
        const appt = appointments.find(a => a.id_turn === id)
        setEditingAppointment(appt)
        setModalOpen(true)
    }

    const handleCreate = () => {
        setEditingAppointment(null)
        setModalOpen(true)
    }

    const handleSave = (data) => {
        if (data.id_turn) {
            // update
            setAppointments(prev => prev.map(a => a.id_turn === data.id_turn ? data : a))
        } else {
            // create new
            const newAppt = { ...data, id_turn: Date.now(), status: "Activo" }
            setAppointments(prev => [...prev, newAppt])
        }
    }

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
                {/* Calendario */}
                <Card className="h-[650px] flex flex-col">
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

                {/* Turnos */}
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

            {/* Modal Crear/Editar */}
            <AppointmentFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                appointment={editingAppointment}
            />
        </div>
    )
}
