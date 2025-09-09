import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "framer-motion"

// Simulación de datos
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
    const [formData, setFormData] = useState({
        email: "",
        motivoConsulta: "Consulta",
    })

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
                    <div className="md:w-1/2">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => {
                                if (!newDate) return
                                setDate(newDate)
                                setTime(null)
                            }}
                            locale={es}
                            className={`
                                p-4 text-lg rounded-2xl
                                [&_.rdp-day]:h-16 [&_.rdp-day]:w-16
                                [&_.rdp-day_selected]:text-primary-foreground [&_.rdp-day_selected]:bg-primary
                                [&_.rdp-day_selected]:rounded-full [&_.rdp-day]:rounded-full
                                [&_.rdp-caption]:mb-4 [&_.rdp-caption_label]:text-lg
                            `}
                            modifiers={{
                                available: Object.keys(doctorAvailability).map((dateStr) => parseISO(dateStr)),
                                today: today,
                            }}
                            modifiersClassNames={{
                                available: "bg-accent text-accent-foreground font-medium hover:bg-accent/80 transition rounded-full",
                                today: "ring-2 ring-primary font-bold rounded-full",
                            }}
                            classNames={{
                                day: "rounded-full mx-0.5 my-0.5", 
                            }}
                            dayClassName={(day) => {
                                const formattedDay = format(day, "yyyy-MM-dd")
                                const isAvailable = Object.keys(doctorAvailability).includes(formattedDay)
                                const isCurrentDay = day.toDateString() === today.toDateString()

                                let className = "rounded-full "

                                if (isCurrentDay && isAvailable) {
                                    className += "bg-accent text-accent-foreground font-semibold ring-2 ring-primary"
                                } else if (isCurrentDay) {
                                    className += "ring-2 ring-primary font-semibold"
                                } else if (isAvailable) {
                                    className += "bg-accent text-accent-foreground hover:bg-accent/80 transition"
                                } else {
                                    className += "text-muted-foreground opacity-60"
                                }

                                return className
                            }}
                            disabled={[{ before: today }]}
                        />
                    </div>
                    <div className="md:w-1/2">
                        <div className="border rounded-lg p-5 h-full bg-card">
                            <div className="mb-5 pb-3 border-b">
                                <p className="text-lg font-semibold text-center">
                                    {format(date, "EEEE, d 'de' MMMM", { locale: es })}
                                </p>
                            </div>

                            <ScrollArea className="h-80">
                                {(doctorAvailability[format(date, "yyyy-MM-dd")] || []).length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3 p-1">
                                        {doctorAvailability[format(date, "yyyy-MM-dd")].map((timeSlot) => (
                                            <Button
                                                key={timeSlot}
                                                variant={time === timeSlot ? "default" : "outline"}
                                                size="lg"
                                                className={`h-12 rounded-lg text-base transition-all border-2 
                                                    ${time === timeSlot
                                                        ? "border-primary ring-2 ring-primary/50"
                                                        : "border-border hover:ring-primary/30"
                                                    }`}
                                                onClick={() => setTime(timeSlot)}
                                            >
                                                {timeSlot}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
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
                            className="bg-card text-card-foreground rounded-xl p-7 max-w-md w-full relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                        >
                            <button
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
                                onClick={() => setTime(null)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            <h3 className="text-xl font-bold mb-5">
                                Reservar turno - {doctor.name}
                            </h3>

                            <div className="mb-6 p-3 bg-muted rounded-lg">
                                <p className="font-medium">
                                    {format(date, "EEEE, d 'de' MMMM", { locale: es })} - {time}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-5">
                                    <Label className="text-base">Motivo del turno</Label>
                                    <RadioGroup
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, motivoConsulta: value }))}
                                        value={formData.motivoConsulta}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Consulta" id="r1" />
                                            <Label htmlFor="r1">Consulta</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Tratamiento" id="r2" />
                                            <Label htmlFor="r2">Tratamiento</Label>
                                        </div>
                                    </RadioGroup>
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
