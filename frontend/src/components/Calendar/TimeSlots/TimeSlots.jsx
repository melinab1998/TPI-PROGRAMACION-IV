import React from "react"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export default function TimeSlots({ date, doctorAvailability, time, setTime }) {
    const slots = doctorAvailability[format(date, "yyyy-MM-dd")] || []

    return (
        <div className="md:w-1/2">
            <div className="border rounded-lg p-5 h-full bg-card">
                <div className="mb-5 pb-3 border-b">
                    <p className="text-lg font-semibold text-center">
                        {format(date, "EEEE, d 'de' MMMM", { locale: undefined })}
                    </p>
                </div>

                <ScrollArea className="h-80">
                    {slots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 p-1">
                            {slots.map((timeSlot) => (
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
    )
}
