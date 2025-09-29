import { useState } from "react"
import {
  format, isSameDay, parseISO,
  startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, addMonths, subMonths
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Calendar({ selectedDate, onDateChange, appointments }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const daysWithAppointments = appointments.reduce((acc, appointment) => {
    const date = format(parseISO(appointment.appointment_date), "yyyy-MM-dd")
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="w-4 h-4" /> Anterior
        </Button>
        <h3 className="font-semibold text-lg capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          Siguiente <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2 flex-shrink-0">
        {weekdays.map((day) => (
          <div key={day} className="text-sm text-center text-muted-foreground font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1 min-h-0 auto-rows-fr">
        {daysInMonth.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd")
          const appointmentCount = daysWithAppointments[dayKey]
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isToday = isSameDay(day, new Date())

          return (
            <div key={dayKey} className="flex justify-center items-center">
              <Button
                variant={isSelected ? "default" : isToday ? "outline" : "ghost"}
                size="lg"
                className={`h-10 w-10 rounded-full flex-col relative p-0 text-sm ${
                  !isCurrentMonth ? "opacity-40" : ""
                } ${
                  isSelected ? "bg-primary/80 hover:bg-primary/90" : ""
                }`}
                onClick={() => onDateChange(day)}
              >
                <span>{format(day, "d")}</span>
                {appointmentCount > 0 && (
                  <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                    isSelected ? "bg-background text-foreground border border-primary/30" : "bg-primary text-primary-foreground"
                  }`}>
                    {appointmentCount}
                  </span>
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}