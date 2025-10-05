import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Header from "@/components/Availability/Header/Header";
import DayRow from "@/components/Availability/DayRow/DayRow";
import WeeklySummary from "@/components/Availability/WeeklySummary/WeeklySummary";
import { successToast, errorToast } from "@/utils/notifications";

// Datos
const daysOfWeek = [
  { id: 1, name: "Lunes", label: "Lun" },
  { id: 2, name: "Martes", label: "Mar" },
  { id: 3, name: "Miércoles", label: "Mié" },
  { id: 4, name: "Jueves", label: "Jue" },
  { id: 5, name: "Viernes", label: "Vie" },
  { id: 6, name: "Sábado", label: "Sáb" },
  { id: 7, name: "Domingo", label: "Dom" }
];

const timeSlots = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
];

export default function Availability() {
  const [availabilities, setAvailabilities] = useState([
    { id_availability: 1, day_of_week: 1, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 2, day_of_week: 2, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 3, day_of_week: 3, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 4, day_of_week: 4, start_time: "09:00", end_time: "17:00", enabled: true },
    { id_availability: 5, day_of_week: 5, start_time: "09:00", end_time: "17:00", enabled: true }
  ]);

  const [errors, setErrors] = useState({});

  // --- Funciones de validación ---
  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const validateTimeSlot = (start, end) => timeToMinutes(start) < timeToMinutes(end);

  const validateDayAvailabilities = (daySlots) => {
    const sorted = [...daySlots].sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));
    for (let i = 0; i < sorted.length - 1; i++) {
      if (timeToMinutes(sorted[i].end_time) > timeToMinutes(sorted[i + 1].start_time)) {
        return { hasError: true, conflictingSlots: [sorted[i].id_availability, sorted[i + 1].id_availability] };
      }
    }
    return { hasError: false, conflictingSlots: [] };
  };

  const validateAllAvailabilities = (toValidate = availabilities) => {
    const newErrors = {};
    daysOfWeek.forEach(day => {
      const daySlots = toValidate.filter(a => a.day_of_week === day.id);
      daySlots.forEach(slot => {
        if (!validateTimeSlot(slot.start_time, slot.end_time)) {
          newErrors[slot.id_availability] = "La hora de fin debe ser posterior a la hora de inicio";
        }
      });

      const hasIndividualErrors = Object.keys(newErrors).some(k => daySlots.some(s => s.id_availability.toString() === k));
      if (!hasIndividualErrors) {
        const validation = validateDayAvailabilities(daySlots);
        if (validation.hasError) {
          validation.conflictingSlots.forEach(id => {
            newErrors[id] = "Los horarios se superponen con otro bloque";
          });
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Funciones de manejo ---
  const getAvailabilityForDay = (dayId) => availabilities.filter(a => a.day_of_week === dayId);

  const handleToggleDay = (dayId, enabled) => {
    if (enabled) {
      const newSlot = { id_availability: Date.now(), day_of_week: dayId, start_time: "09:00", end_time: "17:00", enabled: true };
      setAvailabilities(prev => [...prev, newSlot]);
      setErrors(prev => ({ ...prev, [dayId]: null }));
    } else {
      setAvailabilities(prev => prev.filter(a => a.day_of_week !== dayId));
      setErrors(prev => ({ ...prev, [dayId]: null }));
    }
  };

  const handleTimeChange = (id, field, value) => {
    setAvailabilities(prev => {
      const updated = prev.map(a => a.id_availability === id ? { ...a, [field]: value } : a);
      validateAllAvailabilities(updated);
      return updated;
    });
  };

  const handleAddTimeSlot = (dayId) => {
    const daySlots = getAvailabilityForDay(dayId);
    let newStart = "14:00", newEnd = "18:00";
    if (daySlots.length > 0) {
      const lastEndMinutes = timeToMinutes(daySlots[daySlots.length - 1].end_time);
      if (lastEndMinutes + 30 < timeToMinutes("20:30")) {
        const h = Math.floor((lastEndMinutes + 30)/60).toString().padStart(2,'0');
        const m = ((lastEndMinutes + 30)%60).toString().padStart(2,'0');
        newStart = `${h}:${m}`;
      }
    }
    const newSlot = { id_availability: Date.now(), day_of_week: dayId, start_time: newStart, end_time: newEnd, enabled: true };
    setAvailabilities(prev => {
      const updated = [...prev, newSlot];
      validateAllAvailabilities(updated);
      return updated;
    });
  };

  const handleRemoveAvailability = (id) => {
    setAvailabilities(prev => {
      const updated = prev.filter(a => a.id_availability !== id);
      validateAllAvailabilities(updated);
      return updated;
    });
  };

  const handleSave = () => {
    if (!validateAllAvailabilities()) {
      errorToast("Por favor, corrige los errores en los horarios antes de guardar");
      return;
    }
    successToast("Horarios guardados exitosamente");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Header />

      <motion.div>
        <Card>
          <CardHeader>
            <CardTitle>Horarios de Atención</CardTitle>
            <CardDescription>Configura los horarios en los que estás disponible</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map((day, idx) => (
              <DayRow
                key={day.id}
                day={day}
                slots={getAvailabilityForDay(day.id)}
                errors={errors}
                timeSlots={timeSlots}
                onToggleDay={handleToggleDay}
                onTimeChange={handleTimeChange}
                onAddSlot={handleAddTimeSlot}
                onRemoveSlot={handleRemoveAvailability}
              />
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <WeeklySummary daysOfWeek={daysOfWeek} availabilities={availabilities} errors={errors} />

      <motion.div className="flex justify-center">
        <Button onClick={handleSave} size="lg" className="px-8 bg-primary/90 hover:bg-primary">Guardar Horarios</Button>
      </motion.div>
    </div>
  );
}
