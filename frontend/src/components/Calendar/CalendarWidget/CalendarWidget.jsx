import React from "react"
import { Calendar } from "@/components/ui/calendar"
import { parseISO } from "date-fns"
import { es } from "date-fns/locale"

export default function CalendarWidget({ date, setDate, doctorAvailability, today }) {
    return (
        <div className="md:w-1/2">
            <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                    if (!newDate) return
                    setDate(newDate)
                }}
                locale={es}
                className={`
          p-4 text-lg rounded-2xl
          [&_.rdp-day]:h-16 [&_.rdp-day]:w-16
          [&_.rdp-day_selected]:text-primary-foreground [&_.rdp-day_selected]:bg-primary
          [&_.rdp-day_selected]:rounded-full [&_.rdp-day]:rounded-full
          [&_.rdp-caption]:mb-4 [&_.rdp-caption_label]:text-lg
          [&_.rdp-nav_button]:rounded-full [&_.rdp-nav_button]:h-6 [&_.rdp-nav_button]:w-6
          [&_.rdp-nav_button]:hover:bg-accent [&_.rdp-nav_button]:transition
        `}
                modifiers={{
                    available: Object.keys(doctorAvailability).map((dateStr) => parseISO(dateStr)),
                    today: today,
                }}
                modifiersClassNames={{
                    available: "bg-accent text-accent-foreground font-medium hover:bg-accent/70 transition rounded-full",
                    today: "rounded-full mx-0.5 my-0.5",
                }}
                classNames={{
                    day: "rounded-full mx-0.5 my-0.5",
                }}
            />
        </div>
    )
}
