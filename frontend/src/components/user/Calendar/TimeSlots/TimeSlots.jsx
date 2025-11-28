import React from "react"
import { format, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export default function TimeSlots({ date, doctorAvailability, time, setTime }) {

    const slots = doctorAvailability[format(date, "yyyy-MM-dd")] || [];

    const filteredSlots = slots.filter((slot) => {
        if (!isToday(date)) return true; 

        const now = new Date();
        const [hour, minute] = slot.split(":").map(Number);

        const slotDate = new Date();
        slotDate.setHours(hour, minute, 0, 0);

        return slotDate.getTime() > now.getTime();
    });

    return (
        <div className="md:w-1/2">
            <div className="border rounded-lg p-5 h-full bg-card">
                <div className="mb-5 pb-3 border-b">
                    <p className="text-lg font-semibold text-center">
                        {format(date, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                </div>

                <ScrollArea className="h-80">
                    {filteredSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 p-1">
                            {filteredSlots.map((timeSlot) => (
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
                            {isToday(date)
                                ? "No quedan horarios disponibles hoy"
                                : "No hay turnos disponibles"}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}