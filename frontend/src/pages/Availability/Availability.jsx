import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"

const daysOfWeek = [
  { id: 1, name: "Lunes", label: "Lun" },
  { id: 2, name: "Martes", label: "Mar" },
  { id: 3, name: "Miércoles", label: "Mié" },
  { id: 4, name: "Jueves", label: "Jue" },
  { id: 5, name: "Viernes", label: "Vie" },
  { id: 6, name: "Sábado", label: "Sáb" },
  { id: 7, name: "Domingo", label: "Dom" }
]

const timeSlots = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
]

export default function Availability() {
  const [availabilities, setAvailabilities] = useState([
    { id_availability: 1, day_of_week: 1, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 2, day_of_week: 2, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 3, day_of_week: 3, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 4, day_of_week: 4, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 5, day_of_week: 5, start_time: "09:00", end_time: "17:00", enabled: true }
  ])

  const getAvailabilityForDay = (dayId) =>
    availabilities.filter(avail => avail.day_of_week === dayId)

  const handleToggleDay = (dayId, enabled) => {
    if (enabled) {
      const newAvailability = {
        id_availability: Date.now(),
        day_of_week: dayId,
        start_time: "09:00",
        end_time: "17:00",
        enabled: true
      }
      setAvailabilities(prev => [...prev, newAvailability])
    } else {
      setAvailabilities(prev => prev.filter(avail => avail.day_of_week !== dayId))
    }
  }

  const handleTimeChange = (availabilityId, field, value) => {
    setAvailabilities(prev =>
      prev.map(avail =>
        avail.id_availability === availabilityId
          ? { ...avail, [field]: value }
          : avail
      )
    )
  }

  const handleAddTimeSlot = (dayId) => {
    const newAvailability = {
      id_availability: Date.now(),
      day_of_week: dayId,
      start_time: "14:00",
      end_time: "18:00",
      enabled: true
    }
    setAvailabilities(prev => [...prev, newAvailability])
  }

  const handleRemoveAvailability = (availabilityId) => {
    setAvailabilities(prev => prev.filter(avail => avail.id_availability !== availabilityId))
  }

  const handleSave = () => {
    console.log("Guardando horarios:", availabilities)
    alert("Horarios guardados correctamente")
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-4">
            Configuración de Horarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Establece tus horarios de atención semanales
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Horarios de Atención</CardTitle>
          <CardDescription>
            Configura los horarios en los que estás disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {daysOfWeek.map(day => {
            const dayAvailabilities = getAvailabilityForDay(day.id)
            const isDayEnabled = dayAvailabilities.length > 0

            return (
              <div
                key={day.id}
                className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isDayEnabled}
                    onCheckedChange={(checked) => handleToggleDay(day.id, checked)}
                  />
                  <Label className="font-medium">{day.name}</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isDayEnabled ? (
                    dayAvailabilities.map((availability) => (
                      <div
                        key={availability.id_availability}
                        className="flex items-center gap-2 bg-muted/30 rounded-lg p-2"
                      >
                        <Select
                          value={availability.start_time}
                          onValueChange={(value) =>
                            handleTimeChange(availability.id_availability, "start_time", value)
                          }
                        >
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent className="max-h-60">
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span>-</span>

                        <Select
                          value={availability.end_time}
                          onValueChange={(value) =>
                            handleTimeChange(availability.id_availability, "end_time", value)
                          }
                        >
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent className="max-h-60">
                            {timeSlots
                              .filter(time => time > availability.start_time)
                              .map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        {dayAvailabilities.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAvailability(availability.id_availability)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Cerrado</p>
                  )}
                </div>
                <div className="flex justify-start sm:justify-end">
                  {isDayEnabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTimeSlot(day.id)}
                    >
                      <Plus className="w-4 h-4" /> Agregar
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resumen Semanal</CardTitle>
          <CardDescription>
            Vista previa de tu disponibilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {daysOfWeek.map(day => {
              const dayAvailabilities = getAvailabilityForDay(day.id)
              return (
                <div key={day.id} className="text-center p-3 border rounded-lg">
                  <div className="font-medium mb-2">{day.label}</div>
                  {dayAvailabilities.length > 0 ? (
                    <div className="space-y-1">
                      {dayAvailabilities.map((avail, index) => (
                        <div
                          key={index}
                          className="text-xs px-2 py-1 rounded 
                          bg-primary/90 text-primary-foreground"
                        >
                          {avail.start_time} - {avail.end_time}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground italic">Cerrado</div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          size="lg"
          className="px-8 bg-primary/90 hover:bg-primary"
        >
          Guardar Horarios
        </Button>
      </div>
    </div>
  )
}
