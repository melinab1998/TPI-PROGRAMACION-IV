import { format, parseISO } from "date-fns"
import { CalendarDays, Clock, User, X, MoreVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AppointmentCard({ turno, onEdit, onCancel }) {
    const getStatusVariant = (status) => {
        switch (status) {
            case "Activo": return "default"
            case "Cancelado": return "destructive"
            case "Completado": return "secondary"
            default: return "outline"
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex flex-col items-center min-w-[70px]">
                            <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                                <Clock className="w-4 h-4" />
                                {format(parseISO(turno.appointment_date), "HH:mm")}
                            </div>
                            <Badge variant={getStatusVariant(turno.status)} className="mt-1 text-xs">
                                {turno.status}
                            </Badge>
                        </div>

                        <Separator orientation="vertical" className="h-12" />

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <User className="w-4 h-4" /> {turno.patient_name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 ml-1">{turno.patient_dni}</p>
                            <p className="text-sm text-muted-foreground mt-1 ml-1">{turno.patient_email}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                                {turno.consultation_type}
                            </Badge>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(turno.id_turn)}>
                                <CalendarDays className="mr-2 w-4 h-4" /> Editar turno
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {turno.status !== "Cancelado" && (
                                <DropdownMenuItem className="text-destructive" onClick={() => onCancel(turno.id_turn)}>
                                    <X className="mr-2 w-4 h-4" /> Cancelar turno
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}
