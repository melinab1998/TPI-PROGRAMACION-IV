import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { format } from "date-fns"
import CalendarWidget from "@/components/user/Calendar/CalendarWidget/CalendarWidget"
import TimeSlots from "@/components/user/Calendar/TimeSlots/TimeSlots"
import BookingModal from "@/components/user/Calendar/BookingModal/BookingModal"
import { motion } from "framer-motion"
import { getAllDentists, getAvailability } from "@/services/api.services"

export default function CalendarPage() {
    const { id } = useParams()
    const token = localStorage.getItem("token")

    const [doctor, setDoctor] = useState(null)
    const [doctorAvailability, setDoctorAvailability] = useState({})
    const [loading, setLoading] = useState(true)

    const today = new Date()
    const [date, setDate] = useState(today)
    const [time, setTime] = useState(null)
    const [formData, setFormData] = useState({ email: "", motivoConsulta: "Consulta" })

    // Disponibilidad de prueba hardcodeada
    const fakeAvailability = {
        "2025-10-23": ["08:00", "09:00", "10:00", "11:00"],
        "2025-10-24": ["09:00", "10:30", "11:30", "12:00"],
        "2025-10-25": ["08:00", "09:30", "10:00", "11:30"],
    }

    // Traer el doctor desde la API
    useEffect(() => {
        if (!token) return

        getAllDentists(
            token,
            (data) => {
                const found = data.find(d => d.id === parseInt(id))
                if (found) {
                    setDoctor(found)

                    // Traer disponibilidad del doctor
                    getAvailability(
                        token,
                        found.id,
                        (avail) =>
                            setDoctorAvailability(
                                avail && Object.keys(avail).length ? avail : fakeAvailability
                            ),
                        (err) => {
                            console.error("Error cargando disponibilidad:", err)
                            setDoctorAvailability(fakeAvailability)
                        }
                    )
                } else {
                    setDoctor(null)
                }
                setLoading(false)
            },
            (err) => {
                console.error("Error cargando dentistas:", err)
                setLoading(false)
            }
        )
    }, [id, token])

    if (loading) return <p>Cargando...</p>
    if (!doctor) return <p>Doctor no encontrado</p>

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Turno reservado:", {
            doctor: `${doctor.firstName} ${doctor.lastName}`,
            date: format(date, "yyyy-MM-dd"),
            time,
            ...formData,
        })
        setTime(null)
        setFormData({ email: "", motivoConsulta: "Consulta" })
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
                    Seleccionar Turno
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Elige la fecha y horario para tu cita con {doctor.firstName} {doctor.lastName}
                </p>
            </motion.div>

            <div className="rounded-2xl border p-8 shadow-lg bg-card text-card-foreground">
                <div className="flex max-md:flex-col gap-18">
                    <CalendarWidget
                        date={date}
                        setDate={setDate}
                        doctorAvailability={doctorAvailability}
                        today={today}
                    />
                    <TimeSlots
                        date={date}
                        doctorAvailability={doctorAvailability}
                        time={time}
                        setTime={setTime}
                    />
                </div>
            </div>

            {time && (
                <BookingModal
                    time={time}
                    date={date}
                    doctor={doctor}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    setTime={setTime}
                />
            )}
        </div>
    )
}
