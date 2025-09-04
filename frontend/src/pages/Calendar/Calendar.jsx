import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes } from "react-icons/fa"

const availability = {
    1: {
        "2025-09-02": ["08:00", "09:00", "10:00", "11:00"],
        "2025-09-03": ["09:00", "10:00", "11:00", "12:00"],
        "2025-09-04": ["08:00", "09:30", "11:00", "12:30"],
        "2025-09-05": ["08:00", "09:00", "10:00", "11:00"],
        "2025-09-06": ["09:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "20:00"],
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
    const [formData, setFormData] = useState({
        email: "",
        documento: "",
        fechaNacimiento: "",
    })

    if (!doctor) return <p>Doctor no encontrado</p>

    const availableDates = Object.keys(doctorAvailability).map((d) =>
        new Date(d + "T00:00:00")
    )

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
        setFormData({ email: "", documento: "", fechaNacimiento: "" })
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-8 text-center">
                Disponibilidad de {doctor.name}
            </h2>

            <div className="rounded-xl border p-8 shadow-lg bg-white dark:bg-gray-900">
                <div className="flex max-md:flex-col gap-10">
                    <div className="md:w-1/2">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => {
                                if (!newDate) return;
                                setDate(newDate); 
                                setTime(null);    
                            }}
                            locale={es}
                            className={`
    p-4 text-lg
    [&_.rdp-day]:h-16 [&_.rdp-day]:w-16
    [&_.rdp-day_selected]:text-white [&_.rdp-day_selected]:bg-[var(--accent)]
    [&_.rdp-day_selected]:rounded-full [&_.rdp-day]:rounded-full
    [&_.rdp-caption]:mb-4 [&_.rdp-caption_label]:text-lg
  `}
                            dayClassName={(day) => {
                                const formatted = format(day, "yyyy-MM-dd");

                                if (availableDates.some(d => d.toDateString() === day.toDateString())) {
                                    return "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-foreground)] hover:text-[var(--accent)] cursor-pointer transition"
                                }
                                return "bg-[var(--muted)] text-[var(--muted-foreground)] opacity-60 hover:opacity-80 cursor-pointer transition"
                            }}
                            disabled={[{ before: today }]}
                        />


                    </div>
                    <div className="md:w-1/2">
                        <div className="border rounded-lg p-5 h-full">
                            <div className="mb-5 pb-3 border-b">
                                <p className="text-lg font-semibold text-center">
                                    {format(date, "EEEE, d 'de' MMMM", { locale: es })}
                                </p>
                            </div>

                            <ScrollArea className="h-80 pr-4">
                                {(doctorAvailability[format(date, "yyyy-MM-dd")] || []).length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {doctorAvailability[format(date, "yyyy-MM-dd")].map((timeSlot) => (
                                            <Button
                                                key={timeSlot}
                                                variant={time === timeSlot ? "default" : "outline"}
                                                size="lg"
                                                className="h-12 rounded-lg text-base transition-all"
                                                onClick={() => setTime(timeSlot)}
                                            >
                                                {timeSlot}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-[var(--muted-foreground)]">
                                        No hay turnos disponibles
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {time && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl p-7 max-w-md w-full relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                        >
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => setTime(null)}
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>

                            <h3 className="text-xl font-bold mb-5">
                                Reservar turno - {doctor.name}
                            </h3>

                            <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="font-medium">
                                    {format(date, "EEEE, d 'de' MMMM", { locale: es })} - {time}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-base">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Ingrese su email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="documento" className="text-base">Documento</Label>
                                    <Input
                                        id="documento"
                                        name="documento"
                                        type="text"
                                        placeholder="Ingrese su DNI"
                                        required
                                        value={formData.documento}
                                        onChange={handleInputChange}
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaNacimiento" className="text-base">Fecha de Nacimiento</Label>
                                    <Input
                                        id="fechaNacimiento"
                                        name="fechaNacimiento"
                                        type="date"
                                        required
                                        value={formData.fechaNacimiento}
                                        onChange={handleInputChange}
                                        className="h-11"
                                    />
                                </div>

                                <Button type="submit" className="w-full h-11 text-base mt-2">
                                    Confirmar Turno
                                </Button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}