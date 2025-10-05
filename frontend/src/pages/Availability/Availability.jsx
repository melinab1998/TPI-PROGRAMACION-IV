import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { successToast, errorToast } from "@/utils/notifications";

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
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
]

export default function Availability() {
  const [availabilities, setAvailabilities] = useState([
    { id_availability: 1, day_of_week: 1, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 2, day_of_week: 2, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 3, day_of_week: 3, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 4, day_of_week: 4, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 5, day_of_week: 5, start_time: "09:00", end_time: "17:00", enabled: true }
  ])

  const [errors, setErrors] = useState({})

  // Función para convertir tiempo a minutos desde medianoche
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Validar si hay superposición de horarios para un día específico
  const validateDayAvailabilities = (dayAvailabilities) => {
    const sortedAvailabilities = [...dayAvailabilities].sort((a, b) => 
      timeToMinutes(a.start_time) - timeToMinutes(b.start_time)
    )

    for (let i = 0; i < sortedAvailabilities.length - 1; i++) {
      const current = sortedAvailabilities[i]
      const next = sortedAvailabilities[i + 1]
      
      if (timeToMinutes(current.end_time) > timeToMinutes(next.start_time)) {
        return {
          hasError: true,
          conflictingSlots: [current.id_availability, next.id_availability]
        }
      }
    }
    
    return { hasError: false, conflictingSlots: [] }
  }

  // Validar horario individual (start_time < end_time)
  const validateTimeSlot = (startTime, endTime) => {
    return timeToMinutes(startTime) < timeToMinutes(endTime)
  }

  const getAvailabilityForDay = (dayId) => availabilities.filter(avail => avail.day_of_week === dayId)

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
      // Limpiar error del día al agregar
      setErrors(prev => ({ ...prev, [dayId]: null }))
    } else {
      setAvailabilities(prev => prev.filter(avail => avail.day_of_week !== dayId))
      // Limpiar error del día al deshabilitar
      setErrors(prev => ({ ...prev, [dayId]: null }))
    }
  }

  const handleTimeChange = (availabilityId, field, value) => {
    setAvailabilities(prev => {
      const updated = prev.map(avail => 
        avail.id_availability === availabilityId ? { ...avail, [field]: value } : avail
      )
      
      // Validar después de actualizar
      validateAllAvailabilities(updated)
      
      return updated
    })
  }

  const handleAddTimeSlot = (dayId) => {
    const dayAvailabilities = getAvailabilityForDay(dayId)
    // Encontrar un hueco disponible para el nuevo horario
    let newStartTime = "14:00"
    let newEndTime = "18:00"
    
    if (dayAvailabilities.length > 0) {
      const lastAvailability = dayAvailabilities[dayAvailabilities.length - 1]
      const lastEndMinutes = timeToMinutes(lastAvailability.end_time)
      
      // Proponer un horario después del último existente
      if (lastEndMinutes + 30 < timeToMinutes("20:30")) {
        const newStartMinutes = lastEndMinutes + 30
        const hours = Math.floor(newStartMinutes / 60).toString().padStart(2, '0')
        const minutes = (newStartMinutes % 60).toString().padStart(2, '0')
        newStartTime = `${hours}:${minutes}`
        newEndTime = "18:00" // O calcular un end_time razonable
      }
    }
    
    const newAvailability = { 
      id_availability: Date.now(), 
      day_of_week: dayId, 
      start_time: newStartTime, 
      end_time: newEndTime, 
      enabled: true 
    }
    
    setAvailabilities(prev => {
      const updated = [...prev, newAvailability]
      validateAllAvailabilities(updated)
      return updated
    })
  }

  const handleRemoveAvailability = (availabilityId) => {
    setAvailabilities(prev => {
      const updated = prev.filter(avail => avail.id_availability !== availabilityId)
      validateAllAvailabilities(updated)
      return updated
    })
  }

  // Validar todas las disponibilidades
  const validateAllAvailabilities = (availabilitiesToValidate = availabilities) => {
    const newErrors = {}
    
    daysOfWeek.forEach(day => {
      const dayAvailabilities = availabilitiesToValidate.filter(avail => avail.day_of_week === day.id)
      
      if (dayAvailabilities.length > 0) {
        // Validar horarios individuales
        dayAvailabilities.forEach(avail => {
          if (!validateTimeSlot(avail.start_time, avail.end_time)) {
            newErrors[avail.id_availability] = "La hora de fin debe ser posterior a la hora de inicio"
          }
        })
        
        // Validar superposiciones solo si no hay errores individuales
        if (!Object.keys(newErrors).some(key => dayAvailabilities.some(avail => avail.id_availability.toString() === key))) {
          const validation = validateDayAvailabilities(dayAvailabilities)
          if (validation.hasError) {
            validation.conflictingSlots.forEach(slotId => {
              newErrors[slotId] = "Los horarios se superponen con otro bloque"
            })
          }
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    const isValid = validateAllAvailabilities()
    
    if (!isValid) {
      errorToast("Por favor, corrige los errores en los horarios antes de guardar")
      return
    }
    
    successToast("Horarios guardados exitosamente")
  }

  const fadeSlideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }
  const fadeScale = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <motion.div variants={fadeSlideUp} initial="hidden" animate="visible">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-4">
              Configuración de Horarios
            </h1>
            <p className="text-muted-foreground mt-1">Establece tus horarios de atención semanales</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Horarios de Atención</CardTitle>
            <CardDescription>Configura los horarios en los que estás disponible</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map((day, idx) => {
              const dayAvailabilities = getAvailabilityForDay(day.id)
              const isDayEnabled = dayAvailabilities.length > 0
              const dayHasErrors = dayAvailabilities.some(avail => errors[avail.id_availability])

              return (
                <motion.div key={day.id} variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: idx * 0.05 }}
                  className={`grid grid-cols-1 sm:grid-cols-3 items-center gap-4 p-3 border rounded-lg ${
                    dayHasErrors ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Switch checked={isDayEnabled} onCheckedChange={(checked) => handleToggleDay(day.id, checked)} />
                    <Label className="font-medium">{day.name}</Label>
                    {dayHasErrors && <AlertCircle className="w-4 h-4 text-destructive" />}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isDayEnabled ? dayAvailabilities.map((avail, i) => {
                      const hasError = errors[avail.id_availability]
                      return (
                        <motion.div key={avail.id_availability} variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: i * 0.05 }}
                          className={`flex flex-col gap-1 bg-muted/30 rounded-lg p-2 ${
                            hasError ? 'border border-destructive/50 bg-destructive/5' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Select 
                                value={avail.start_time} 
                                onValueChange={(value) => handleTimeChange(avail.id_availability, "start_time", value)}
                              >
                                <SelectTrigger className={`w-20 ${hasError ? 'border-destructive' : ''}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {timeSlots.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span>-</span>
                              <Select 
                                value={avail.end_time} 
                                onValueChange={(value) => handleTimeChange(avail.id_availability, "end_time", value)}
                              >
                                <SelectTrigger className={`w-20 ${hasError ? 'border-destructive' : ''}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {timeSlots.filter(time => time > avail.start_time).map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {dayAvailabilities.length > 1 && (
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveAvailability(avail.id_availability)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          {hasError && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {hasError}
                            </p>
                          )}
                        </motion.div>
                      )
                    }) : (
                      <p className="text-sm text-muted-foreground italic">Cerrado</p>
                    )}
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    {isDayEnabled && (
                      <Button variant="outline" size="sm" onClick={() => handleAddTimeSlot(day.id)}>
                        <Plus className="w-4 h-4" /> Agregar
                      </Button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeScale} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Resumen Semanal</CardTitle>
            <CardDescription>Vista previa de tu disponibilidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {daysOfWeek.map(day => {
                const dayAvailabilities = getAvailabilityForDay(day.id)
                const dayHasErrors = dayAvailabilities.some(avail => errors[avail.id_availability])
                
                return (
                  <motion.div 
                    key={day.id} 
                    variants={fadeSlideUp} 
                    initial="hidden" 
                    animate="visible" 
                    className={`text-center p-3 border rounded-lg ${
                      dayHasErrors ? 'border-destructive/50 bg-destructive/5' : ''
                    }`}
                  >
                    <div className="font-medium mb-2">{day.label}</div>
                    {dayAvailabilities.length > 0 ? (
                      <div className="space-y-1">
                        {dayAvailabilities.map((avail, i) => {
                          const hasError = errors[avail.id_availability]
                          return (
                            <motion.div 
                              key={i} 
                              variants={fadeSlideUp} 
                              initial="hidden" 
                              animate="visible" 
                              transition={{ delay: i * 0.05 }} 
                              className={`text-xs px-2 py-1 rounded ${
                                hasError 
                                  ? 'bg-destructive/20 text-destructive border border-destructive/30' 
                                  : 'bg-primary/90 text-primary-foreground'
                              }`}
                            >
                              {avail.start_time} - {avail.end_time}
                              {hasError && <AlertCircle className="w-3 h-3 inline ml-1" />}
                            </motion.div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic">Cerrado</div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="flex justify-center">
        <Button onClick={handleSave} size="lg" className="px-8 bg-primary/90 hover:bg-primary">
          Guardar Horarios
        </Button>
      </motion.div>
    </div>
  )
}