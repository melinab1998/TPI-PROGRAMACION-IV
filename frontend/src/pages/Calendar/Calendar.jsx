import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import CalendarWidget from "@/components/Calendar/CalendarWidget/CalendarWidget"
import TimeSlots from "@/components/Calendar/TimeSlots/TimeSlots"
import BookingModal from "@/components/Calendar/BookingModal/BookingModal"
import { motion } from "framer-motion"

const availability = {
    1: {
        "2025-10-07": ["08:00", "09:00", "10:00", "11:00"],
        "2025-10-08": ["09:00", "10:00", "11:00", "12:00"],
        "2025-10-14": ["08:00", "09:30", "11:00", "12:30"],
        "2025-10-18": ["08:00", "09:00", "10:00", "11:00"],
        "2025-10-21": ["09:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "20:00"],
        "2025-10-25": ["10:00", "11:00", "14:00", "15:00", "16:00"],
        "2025-10-28": ["08:30", "09:30", "10:30", "11:30", "13:00"],
        "2025-10-30": ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"],
    },
}

const doctorsData = [{ id: 1, name: "Dr. Juan Pérez" }]

export default function CalendarPage() {
    const { id } = useParams()
    const doctor = doctorsData.find((d) => d.id === parseInt(id))
    const doctorAvailability = availability[id] || {}

    const today = new Date()
    const [date, setDate] = useState(today)
    const [time, setTime] = useState(null)
    const [formData, setFormData] = useState({ email: "", motivoConsulta: "Consulta" })

    if (!doctor) return <p>Doctor no encontrado</p>

    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Turno reservado:", {
            doctor: doctor.name,
            date: format(date, "yyyy-MM-dd"),
            time,
            ...formData,
        })
        alert("Turno reservado con éxito!")
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
                    Elige la fecha y horario para tu cita con {doctor.name}
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