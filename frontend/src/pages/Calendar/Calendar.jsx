import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"

const availability = {
  1: {
    "2025-09-02": ["08:00", "09:00", "10:00", "11:00"],
    "2025-09-05": ["09:00", "10:00", "11:00", "12:00"],
    "2025-09-07": ["08:00", "09:30", "11:00", "12:30"],
    "2025-09-11": ["08:00", "09:00", "10:00", "11:00"],
    "2025-09-15": ["09:00", "10:00", "11:00", "12:00"],
  },
}

const doctorsData = [{ id: 1, name: "Dr. Juan Pérez" }]

export default function CalendarPage() {
  const { id } = useParams()
  const doctor = doctorsData.find((d) => d.id === parseInt(id))
  const doctorAvailability = availability[parseInt(id ?? "0")] || {}

  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(null)
  const [formData, setFormData] = useState({
    email: "",
    documento: "",
    fechaNacimiento: "",
  })

  if (!doctor) return <p>Doctor no encontrado</p>

  const availableDates = new Set(Object.keys(doctorAvailability))

  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : null
  const timeSlots =
    selectedDateStr && doctorAvailability[selectedDateStr]
      ? doctorAvailability[selectedDateStr]
      : []

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Turno reservado:", {
      doctor: doctor.name,
      fecha: selectedDateStr,
      hora: time,
      ...formData,
    })
    alert("Turno reservado con éxito!")
    setTime(null)
    setFormData({ email: "", documento: "", fechaNacimiento: "" })
  }

  const capitalizeFirstLetter = (str) => {
    if (!str) return ""
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const formatDateWithCapitalization = (date) => {
    if (!date) return "Seleccione un día"

    const formattedDayOfWeek = capitalizeFirstLetter(
      format(date, "EEEE", { locale: es })
    )
    const formattedDate = format(date, "d 'de'", { locale: es })
    const formattedMonth = capitalizeFirstLetter(
      format(date, "MMMM", { locale: es })
    )

    return `${formattedDayOfWeek}, ${formattedDate} ${formattedMonth}`
  }

  // Función para formatear la fecha en el modal
  const formatModalDate = (date) => {
    if (!date) return ""
    
    const day = capitalizeFirstLetter(format(date, "EEEE", { locale: es }))
    const dayNumber = format(date, "d", { locale: es })
    const month = capitalizeFirstLetter(format(date, "MMMM", { locale: es }))
    
    return `${day} ${dayNumber} de ${month}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold mb-6">
        Disponibilidad de {doctor.name}
      </h2>

      <div className="rounded-md border">
        <div className="flex max-sm:flex-col">
          {/* Calendario */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate || new Date())
              setTime(null)
            }}
            locale={es}
            className="p-4 text-base 
                       [&_.rdp-day]:h-12 
                       [&_.rdp-day]:w-12 
                       [&_.rdp-day]:text-base 
                       [&_.rdp-caption_label]:text-lg 
                       [&_.rdp-nav_button]:h-9 
                       [&_.rdp-nav_button]:w-9 
                       [&_.rdp-day]:rounded-full 
                       [&_.rdp-day_outside]:rounded-full
                       [&_.rdp-day_selected]:rounded-full"
            modifiers={{
              available: (day) => availableDates.has(format(day, 'yyyy-MM-dd')),
              unavailable: (day) => !availableDates.has(format(day, 'yyyy-MM-dd')),
            }}
            modifiersClassNames={{
              available: 'bg-accent text-accent-foreground font-semibold',
              unavailable: 'text-muted-foreground cursor-not-allowed',
            }}
          />

          {/* Lista de horarios */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <div className="h-full border-l max-sm:border-t max-sm:border-l-0 p-4">
              <div className="space-y-3 h-full flex flex-col">
                <div className="flex h-6 shrink-0 items-center">
                  <p className="text-sm font-medium">
                    {formatDateWithCapitalization(date)}
                  </p>
                </div>
                <ScrollArea className="flex-grow">
                  <div className="grid gap-1.5 max-sm:grid-cols-2">
                    {timeSlots.length > 0 ? (
                      timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={time === slot ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          onClick={() => setTime(slot)}
                        >
                          {slot}
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm font-medium pt-2">
                        No hay horarios disponibles
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Reserva */}
      <AnimatePresence>
        {time && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                onClick={() => setTime(null)}
              >
                <FaTimes className="h-5 w-5" />
              </button>
              <h3 className="text-2xl font-bold mb-4">
                Reservar turno - {doctor.name}
              </h3>
              <p className="mb-4">
                Día: {formatModalDate(date)} - Hora: {time}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ingrese su email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="documento">Documento</Label>
                  <Input
                    id="documento"
                    name="documento"
                    type="text"
                    placeholder="Ingrese su DNI"
                    required
                    value={formData.documento}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    required
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                  />
                </div>
                <Button type="submit" className="w-full">
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