import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function DaySummary({ selectedDate, count }) {
    return (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-lg font-semibold text-center capitalize">
                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: es })}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
                {count} turno(s) programado(s)
            </p>
        </div>
    )
}
