import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DayRow from "@/components/admin/Availability/DayRow/DayRow";
import WeeklySummary from "@/components/admin/Availability/WeeklySummary/WeeklySummary";
import { successToast, errorToast } from "@/utils/notifications";
import Header from "@/components/common/Header/Header";
import { availabilityValidations } from "@/utils/validations";
import { getAvailability, setAvailability } from "@/services/api.services";
import { AuthContext } from "@/services/auth/AuthContextProvider";

const daysOfWeek = [
  { id: 1, name: "Lunes", label: "Lun" },
  { id: 2, name: "Martes", label: "Mar" },
  { id: 3, name: "Miércoles", label: "Mié" },
  { id: 4, name: "Jueves", label: "Jue" },
  { id: 5, name: "Viernes", label: "Vie" },
  { id: 6, name: "Sábado", label: "Sáb" },
  { id: 7, name: "Domingo", label: "Dom" },
];

const timeSlots = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
];

export default function Availability() {
  const { token, userId } = useContext(AuthContext);
  const [availabilities, setAvailabilities] = useState([]);
  const [errors, setErrors] = useState({});

  // ---------- Helpers ----------
  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const validateTimeSlot = (start, end) =>
    availabilityValidations.timeSlot.validateTimeSlot(start, end);

  const validateDayAvailabilities = (daySlots) => {
    const sorted = [...daySlots].sort(
      (a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time)
    );
    for (let i = 0; i < sorted.length - 1; i++) {
      if (timeToMinutes(sorted[i].end_time) > timeToMinutes(sorted[i + 1].start_time)) {
        return {
          hasError: true,
          conflictingSlots: [sorted[i].id_availability, sorted[i + 1].id_availability],
        };
      }
    }
    return { hasError: false, conflictingSlots: [] };
  };

  const validateAllAvailabilities = (toValidate = availabilities) => {
    const newErrors = {};
    daysOfWeek.forEach((day) => {
      const daySlots = toValidate.filter((a) => a.day_of_week === day.id);
      daySlots.forEach((slot) => {
        if (!validateTimeSlot(slot.start_time, slot.end_time)) {
          newErrors[slot.id_availability] =
            availabilityValidations.timeSlot.errorMessages.invalidTimeSlot;
        }
      });

      const hasIndividualErrors = Object.keys(newErrors).some((k) =>
        daySlots.some((s) => s.id_availability.toString() === k)
      );
      if (!hasIndividualErrors) {
        const validation = validateDayAvailabilities(daySlots);
        if (validation.hasError) {
          validation.conflictingSlots.forEach((id) => {
            newErrors[id] = availabilityValidations.timeSlot.errorMessages.overlappingSlots;
          });
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getAvailabilityForDay = (dayId) =>
    availabilities.filter((a) => a.day_of_week === dayId);

  // ---------- Cargar disponibilidad desde backend ----------
  const loadAvailabilities = () => {
    if (!token || !userId) return;

    getAvailability(
      token,
      userId,
      (data) => {
        const formatted = data.map((slot) => ({
          id_availability: slot.id,
          day_of_week: slot.dayOfWeek === 0 ? 7 : slot.dayOfWeek,
          start_time: slot.startTime.slice(0, 5),
          end_time: slot.endTime.slice(0, 5),
          enabled: true,
        }));
        setAvailabilities(formatted);
      },
      (err) => console.error("Error al cargar horarios:", err)
    );
  };

  useEffect(() => {
    loadAvailabilities();
  }, [token, userId]);

  // ---------- Eventos ----------
  const handleToggleDay = (dayId, enabled) => {
    if (enabled) {
      const newSlot = {
        id_availability: Date.now(),
        day_of_week: dayId,
        start_time: "09:00",
        end_time: "17:00",
        enabled: true,
      };
      setAvailabilities((prev) => [...prev, newSlot]);
      setErrors((prev) => ({ ...prev, [dayId]: null }));
    } else {
      setAvailabilities((prev) => prev.filter((a) => a.day_of_week !== dayId));
      setErrors((prev) => ({ ...prev, [dayId]: null }));
    }
  };

  const handleTimeChange = (id, field, value) => {
    setAvailabilities((prev) => {
      const updated = prev.map((a) =>
        a.id_availability === id ? { ...a, [field]: value } : a
      );
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
        const h = Math.floor((lastEndMinutes + 30) / 60).toString().padStart(2, '0');
        const m = ((lastEndMinutes + 30) % 60).toString().padStart(2, '0');
        newStart = `${h}:${m}`;
      }
    }
    const newSlot = {
      id_availability: Date.now(),
      day_of_week: dayId,
      start_time: newStart,
      end_time: newEnd,
      enabled: true,
    };
    setAvailabilities((prev) => {
      const updated = [...prev, newSlot];
      validateAllAvailabilities(updated);
      return updated;
    });
  };

  const handleRemoveAvailability = (id) => {
    setAvailabilities((prev) => {
      const updated = prev.filter((a) => a.id_availability !== id);
      validateAllAvailabilities(updated);
      return updated;
    });
  };

  // ---------- Guardar en backend ----------
  const handleSave = () => {
    if (!validateAllAvailabilities()) {
      errorToast("Por favor, corrige los errores en los horarios antes de guardar");
      return;
    }

    const mapDayToBackend = (day) => (day === 7 ? 0 : day);
    const formattedAvailabilities = availabilities.map((slot) => ({
      dayOfWeek: mapDayToBackend(slot.day_of_week),
      startTime: `${slot.start_time}:00`,
      endTime: `${slot.end_time}:00`,
    }));

    setAvailability(
      token,
      userId,
      formattedAvailabilities,
      () => {
        successToast("Horarios guardados exitosamente");
        loadAvailabilities();
      },
      (err) => errorToast(err.message || "Error al guardar los horarios")
    );
  };

  // ---------- Render ----------
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Header
        title="Configuración de Horarios"
        subtitle="Establece tus horarios de atención semanales"
      />

      <motion.div>
        <Card>
          <CardHeader>
            <CardTitle>Horarios de Atención</CardTitle>
            <CardDescription>
              Configura los horarios en los que estás disponible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map((day) => (
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
        <Button
          onClick={handleSave}
          size="lg"
          className="px-8 bg-primary/90 hover:bg-primary"
        >
          Guardar Horarios
        </Button>
      </motion.div>
    </div>
  );
}