import React, { useState } from "react"
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, Clock, User, X, MoreVertical, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const initialAppointments = [
    {
        id_turn: 101,
        appointment_date: "2025-09-30T09:00:00",
        status: "Activo",
        consultation_type: "Consulta",
        patient_name: "María López",
        patient_email: "maria@email.com",
        patient_dni: "41239736"
    },
    {
        id_turn: 102,
        appointment_date: "2025-09-30T10:00:00",
        status: "Activo",
        consultation_type: "Tratamiento",
        patient_name: "Juan Pérez",
        patient_email: "juan@email.com",
        patient_dni: "41239736"
    },
    {
        id_turn: 103,
        appointment_date: "2025-09-30T11:30:00",
        status: "Cancelado",
        consultation_type: "Tratamiento",
        patient_name: "Ana Gómez",
        patient_email: "ana@email.com",
        patient_dni: "41239736"
    },
    {
        id_turn: 111,
        appointment_date: "2025-09-30T10:00:00",
        status: "Activo",
        consultation_type: "Tratamiento",
        patient_name: "Juan Pérez",
        patient_email: "juan@email.com",
        patient_dni: "41239736"
    },
    {
        id_turn: 104,
        appointment_date: "2025-10-01T15:00:00",
        status: "Activo",
        consultation_type: "Consulta",
        patient_name: "Pedro Ruiz",
        patient_email: "pedro@email.com",
        patient_dni: "41239736"
    },
    {
        id_turn: 105,
        appointment_date: "2025-10-02T14:00:00",
        status: "Activo",
        consultation_type: "Consulta",
        patient_name: "Carlos Mendoza",
        patient_email: "carlos@email.com",
        patient_dni: "41239736"
    },
];

function AgendaCalendar({ selectedDate, onDateChange, appointments }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const daysWithAppointments = appointments.reduce((acc, appointment) => {
        const date = format(parseISO(appointment.appointment_date), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const goToPreviousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth} className="flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                </Button>
                <h3 className="font-semibold text-lg capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h3>
                <Button variant="outline" size="sm" onClick={goToNextMonth} className="flex items-center gap-1">
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-3">
                {weekdays.map((day) => (
                    <div key={day} className="text-sm text-center text-muted-foreground font-medium py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day) => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const appointmentCount = daysWithAppointments[dayKey];
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={dayKey} className="flex justify-center">
                            <Button
                                variant={isSelected ? "default" : isToday ? "outline" : "ghost"}
                                size="lg"
                                className={`h-12 w-12 rounded-full flex-col relative p-0 ${!isCurrentMonth ? 'text-muted-foreground opacity-40' : ''
                                    } ${isToday && !isSelected ? 'border-primary' : ''}`}
                                onClick={() => onDateChange(day)}
                            >
                                <span className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : ''}`}>
                                    {format(day, 'd')}
                                </span>

                                {appointmentCount > 0 && (
                                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${isSelected ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                                        }`}>
                                        {appointmentCount}
                                    </span>
                                )}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function AdminSchedule() {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [appointments, setAppointments] = useState(initialAppointments);
    const [filters, setFilters] = useState({
        patient: "",
        status: "Todos",
    });

    const handleCancel = (id) => {
        if (confirm(`¿Está seguro de cancelar el turno ${id}?`)) {
            setAppointments(prev => prev.map(a =>
                a.id_turn === id ? { ...a, status: "Cancelado" } : a
            ));
            console.log(`Turno ${id} cancelado.`);
        }
    };

    const handleEdit = (id) => {
        alert(`Abrir modal/página de edición para el Turno ${id}`);
    };

    const handleCreate = () => {
        alert("Abrir modal para AGENDAR un nuevo turno para paciente.");
    };

    const filteredAppointments = appointments.filter(appointment => {
        const appointmentDate = parseISO(appointment.appointment_date);

        const isSameDayAppointment = isSameDay(appointmentDate, selectedDate);
        if (!isSameDayAppointment) return false;

        const patientMatch = appointment.patient_name.toLowerCase().includes(filters.patient.toLowerCase());
        if (!patientMatch) return false;

        const statusMatch = filters.status === "Todos" || appointment.status === filters.status;
        if (!statusMatch) return false;

        return true;
    });

    const appointmentsForSelectedDay = appointments.filter(appointment =>
        isSameDay(parseISO(appointment.appointment_date), selectedDate)
    );

    const getStatusVariant = (status) => {
        switch (status) {
            case "Activo": return "default";
            case "Cancelado": return "destructive";
            case "Completado": return "secondary";
            default: return "outline";
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mt-4 mb-2">Agenda de Turnos</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestiona y visualiza todos los turnos programados
                    </p>
                </div>
                <Button onClick={handleCreate} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Turno
                </Button>
            </div>

            {/* Contenedor principal con altura fija */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
                {/* Card del Calendario - Altura fija */}
                <Card className="h-fit"> {/* h-fit para que crezca con su contenido pero no se expanda */}
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <CalendarDays className="w-5 h-5" />
                            Calendario de Turnos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <AgendaCalendar
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                            appointments={appointments}
                        />

                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                            <p className="text-lg font-semibold text-center capitalize">
                                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: es })}
                            </p>
                            <p className="text-sm text-muted-foreground text-center mt-1">
                                {appointmentsForSelectedDay.length} turno(s) programado(s)
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Card de Turnos - Scroll interno */}
                <Card className="flex flex-col min-h-0"> {/* min-h-0 para permitir scroll interno */}
                    <CardHeader className="pb-3 flex-shrink-0"> {/* flex-shrink-0 para que no se encoja */}
                        <CardTitle className="text-xl">Turnos del Día</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {filteredAppointments.length} turno(s) encontrado(s)
                            </p>
                            <Badge variant="outline" className="w-fit">
                                {filteredAppointments.length} de {appointmentsForSelectedDay.length}
                            </Badge>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-4 flex flex-col flex-1 min-h-0"> {/* flex-1 min-h-0 para scroll */}
                        {/* Filtros en la misma fila - 50/50 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 flex-shrink-0"> {/* flex-shrink-0 para fijar filtros */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar paciente..."
                                    value={filters.patient}
                                    onChange={(e) => setFilters({ ...filters, patient: e.target.value })}
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => setFilters({ ...filters, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado del turno" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todos">Todos los estados</SelectItem>
                                    <SelectItem value="Activo">Activos</SelectItem>
                                    <SelectItem value="Cancelado">Cancelados</SelectItem>
                                    <SelectItem value="Completado">Completados</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Lista de turnos con scroll interno */}
                        <div className="space-y-3 flex-1 overflow-y-auto"> {/* flex-1 para ocupar espacio disponible */}
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments
                                    .sort((a, b) => parseISO(a.appointment_date) - parseISO(b.appointment_date))
                                    .map((turno) => (
                                        <Card key={turno.id_turn} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className="flex flex-col items-center min-w-[70px]">
                                                            <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                                                                <Clock className="w-4 h-4" />
                                                                {format(parseISO(turno.appointment_date), "HH:mm")}
                                                            </div>
                                                            <Badge
                                                                variant={getStatusVariant(turno.status)}
                                                                className="mt-1 text-xs"
                                                            >
                                                                {turno.status}
                                                            </Badge>
                                                        </div>

                                                        <Separator orientation="vertical" className="h-12" />

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-base flex items-center gap-2">
                                                                <User className="w-4 h-4 flex-shrink-0" />
                                                                {turno.patient_name}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground mt-1 ml-1">
                                                                {turno.patient_dni}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-1 ml-1">
                                                                {turno.patient_email}
                                                            </p>
                                                            <Badge variant="outline" className="mt-2 text-xs">
                                                                {turno.consultation_type}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="flex-shrink-0">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleEdit(turno.id_turn)}>
                                                                <CalendarDays className="mr-2 w-4 h-4" />
                                                                Editar turno
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            {turno.status !== "Cancelado" && (
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => handleCancel(turno.id_turn)}
                                                                >
                                                                    <X className="mr-2 w-4 h-4" />
                                                                    Cancelar turno
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <CalendarDays className="w-16 h-16 mx-auto mb-3 opacity-50" />
                                    <p className="text-base">No hay turnos para esta fecha</p>
                                    {appointmentsForSelectedDay.length > 0 && filters.patient && (
                                        <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}