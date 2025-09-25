import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import CalendarWidget from "@/components/Calendar/CalendarWidget/CalendarWidget"
import TimeSlots from "@/components/Calendar/TimeSlots/TimeSlots"
import BookingModal from "@/components/Calendar/BookingModal/BookingModal"

const availability = {
    1: {
        "2025-09-10": ["08:00", "09:00", "10:00", "11:00"],
        "2025-09-11": ["09:00", "10:00", "11:00", "12:00"],
        "2025-09-15": ["08:00", "09:30", "11:00", "12:30"],
        "2025-09-20": ["08:00", "09:00", "10:00", "11:00"],
        "2025-09-21": ["09:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "20:00"],
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
            <h2 className="text-2xl font-bold mb-8 text-center">
                Disponibilidad de {doctor.name}
            </h2>

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
