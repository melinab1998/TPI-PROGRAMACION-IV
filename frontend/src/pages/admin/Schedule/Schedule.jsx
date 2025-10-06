import { useState } from "react"
import { parseISO, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Calendar from "@/components/admin/Schedule/Calendar/Calendar"
import DaySummary from "@/components/admin/Schedule/DaySummary/DaySummary"
import AppointmentList from "@/components/admin/Schedule/AppointmentList/AppointmentList"
import AppointmentFormModal from "@/components/admin/Schedule/AppointmentFormModal/AppointmentFormModal"
import CancelAppointmentModal from "@/components/admin/Schedule/CancelAppointmentModal/CancelAppointmentModal"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import Header from "@/components/common/Header/Header"

const initialAppointments = [
    { id_turn: 101, appointment_date: "2025-09-30T09:00", status: "Activo", consultation_type: "Consulta", patient_name: "María López", patient_email: "maria@email.com", patient_dni: "41239736", dentist_name: "Dr. Suárez" },
    { id_turn: 102, appointment_date: "2025-09-30T10:00", status: "Activo", consultation_type: "Tratamiento", patient_name: "Juan Pérez", patient_email: "juan@email.com", patient_dni: "41239736", dentist_name: "Dr. Suárez" },
    { id_turn: 103, appointment_date: "2025-09-30T11:00", status: "Activo", consultation_type: "Tratamiento", patient_name: "Juan Pérez", patient_email: "juan@email.com", patient_dni: "41239736", dentist_name: "Dr. Suárez" },
    { id_turn: 104, appointment_date: "2025-11-30T12:00", status: "Activo", consultation_type: "Tratamiento", patient_name: "Juan Pérez", patient_email: "juan@email.com", patient_dni: "41239736", dentist_name: "Dr. Suárez" }
]

export default function AdminSchedule() {
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [appointments, setAppointments] = useState(initialAppointments)
    const [filters, setFilters] = useState({ patient: "", status: "Todos" })
    const [modalOpen, setModalOpen] = useState(false)
    const [cancelModalOpen, setCancelModalOpen] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState(null)
    const [cancelingAppointment, setCancelingAppointment] = useState(null)

    const handleCancelClick = (id) => {
        const appointment = appointments.find(a => a.id_turn === id)
        setCancelingAppointment(appointment)
        setCancelModalOpen(true)
    }

    const handleConfirmCancel = (id) => {
        setAppointments(prev => prev.map(a =>
            a.id_turn === id ? { ...a, status: "Cancelado" } : a
        ))
        setCancelModalOpen(false)
        setCancelingAppointment(null)
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
            setAppointments(prev => prev.map(a => a.id_turn === data.id_turn ? data : a))
        } else {
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

    const fadeSlideUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    }

    const fadeSlideDown = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <motion.div
                variants={fadeSlideDown}
                initial="hidden"
                animate="visible"
            >
                <Header
                    title="Agenda de Turnos"
                    subtitle="Gestiona todos los turnos de tus pacientes"
                    onCreate={handleCreate}
                    actionLabel="Nuevo Turno"
                    actionIcon={Plus}
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={fadeSlideUp} initial="hidden" animate="visible">
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
                </motion.div>

                <motion.div
                    variants={fadeSlideUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                >
                    <AppointmentList
                        appointments={appointments}
                        filteredAppointments={filteredAppointments}
                        appointmentsForSelectedDay={appointmentsForSelectedDay}
                        filters={filters}
                        setFilters={setFilters}
                        onEdit={handleEdit}
                        onCancel={handleCancelClick}
                    />
                </motion.div>
            </div>

            <AppointmentFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                appointment={editingAppointment}
            />
            <CancelAppointmentModal
                open={cancelModalOpen}
                onClose={() => {
                    setCancelModalOpen(false)
                    setCancelingAppointment(null)
                }}
                onConfirm={handleConfirmCancel}
                appointment={cancelingAppointment}
            />
        </div>
    )
}

