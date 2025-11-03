import { useState, useEffect, useContext } from "react"
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
import { getDentistTurns, getPatientById, getDentistById, cancelTurn } from "@/services/api.services"
import { AuthContext } from "@/services/auth/AuthContextProvider"

export default function AdminSchedule() {
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ patient: "", status: "Todos" })
    const [modalOpen, setModalOpen] = useState(false)
    const [cancelModalOpen, setCancelModalOpen] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState(null)
    const [cancelingAppointment, setCancelingAppointment] = useState(null)

    const { token, userId } = useContext(AuthContext);

    const enrichTurnData = async (turn) => {
        try {
            const patientData = await new Promise((resolve, reject) => {
                getPatientById(turn.patientId, token, resolve, reject)
            })

            const dentistData = await new Promise((resolve, reject) => {
                getDentistById(turn.dentistId, token, resolve, reject)
            })

            return {
                id_turn: turn.id,
                appointment_date: turn.appointmentDate,
                status: turn.status,
                consultation_type: turn.consultationType || "Consulta",
                patient_name: `${patientData.firstName} ${patientData.lastName}`,
                patient_email: patientData.email,
                patient_dni: patientData.dni,
                dentist_name: `Dr. ${dentistData.firstName} ${dentistData.lastName}`,
                patientId: turn.patientId,
                dentistId: turn.dentistId
            }
        } catch (error) {
            console.error("Error enriqueciendo datos del turno:", error)
            return {
                id_turn: turn.id,
                appointment_date: turn.appointmentDate,
                status: turn.status,
                consultation_type: turn.consultationType || "Consulta",
                patient_name: "Paciente no encontrado",
                patient_email: "",
                patient_dni: "",
                dentist_name: "Dentista no encontrado",
                patientId: turn.patientId,
                dentistId: turn.dentistId
            }
        }
    }

    useEffect(() => {
        if (token && userId) {
            loadAppointments()
        }
    }, [token, userId])

    const loadAppointments = async () => {
        if (!token || !userId) {
            console.error("No hay token o ID de usuario disponibles")
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            // 🔥 Ahora se obtienen solo los turnos del dentista logueado:
            const turns = await new Promise((resolve, reject) => {
                getDentistTurns(token, userId, resolve, reject)
            })

            const enrichedAppointments = await Promise.all(
                turns.map(turn => enrichTurnData(turn))
            )

            setAppointments(enrichedAppointments)
        } catch (error) {
            console.error("Error cargando turnos:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelClick = (id) => {
        const appointment = appointments.find(a => a.id_turn === id)
        setCancelingAppointment(appointment)
        setCancelModalOpen(true)
    }

    const handleConfirmCancel = async (id) => {
        try {
            await new Promise((resolve, reject) => {
                cancelTurn(token, id, resolve, reject)
            })

            setAppointments(prev => prev.map(a =>
                a.id_turn === id ? { ...a, status: "Cancelled" } : a
            ))
            setCancelModalOpen(false)
            setCancelingAppointment(null)
        } catch (error) {
            console.error("Error cancelando turno:", error)
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

    const handleSave = async (turnFromBackend) => {
        try {
            const enrichedTurn = await enrichTurnData(turnFromBackend)

            if (editingAppointment) {
                setAppointments(prev =>
                    prev.map(a =>
                        a.id_turn === enrichedTurn.id_turn ? enrichedTurn : a
                    )
                )
            } else {
                setAppointments(prev => [...prev, enrichedTurn])
            }

            setModalOpen(false)
            setEditingAppointment(null)
        } catch (error) {
            console.error("Error guardando turno:", error)
        }
    }

    const filteredAppointments = appointments.filter(a => {
        const appointmentDate = parseISO(a.appointment_date)
        if (!isSameDay(appointmentDate, selectedDate)) return false
        if (!a.patient_name.toLowerCase().includes(filters.patient.toLowerCase())) return false
        if (filters.status !== "Todos" && a.status !== filters.status) return false
        return true
    })

    const appointmentsForSelectedDay = appointments.filter(
        a =>
            isSameDay(parseISO(a.appointment_date), selectedDate) &&
            a.status === "Pending"
    )

    const fadeSlideUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    }

    const fadeSlideDown = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Cargando turnos...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <motion.div variants={fadeSlideDown} initial="hidden" animate="visible">
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
                onClose={() => {
                    setModalOpen(false)
                    setEditingAppointment(null)
                }}
                onSave={handleSave}
                appointment={editingAppointment}
            />

            <CancelAppointmentModal
                open={cancelModalOpen}
                onClose={() => {
                    setCancelModalOpen(false)
                    setCancelingAppointment(null)
                }}
                appointment={cancelingAppointment}
                onCancelled={(id) => {
                    setAppointments(prev =>
                        prev.map(a => a.id_turn === id ? { ...a, status: "Cancelled" } : a)
                    )
                    setCancelModalOpen(false)
                    setCancelingAppointment(null)
                }}
            />
        </div>
    )
}
