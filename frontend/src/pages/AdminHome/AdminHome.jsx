import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, Clock, ArrowRight, User, Calendar, X } from "lucide-react"

export default function AdminHome() {
  const dentistName = "Dra. García"

  const nextAppointment = {
    paciente: "Juan Pérez",
    fecha: "Hoy, 30/09/2025",
    hora: "15:30",
    tipo: "Consulta",
  }

  const todayStats = {
    total: 5,
    pending: 2,
    cancelled: 1,
  }

  return (
    <div className="px-2 sm:px-4 lg:px-6 py-8 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          ¡Bienvenida, {dentistName}!
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      {/* Cards estadísticas */}
<div className="flex justify-center">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md w-full">
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center h-full p-4">
        <Calendar className="w-6 h-6 text-primary mb-2" />
        <div className="text-xl font-bold text-primary">
          {todayStats.total}
        </div>
        <div className="text-xs text-muted-foreground">Turnos hoy</div>
      </CardContent>
    </Card>

    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center h-full p-4">
        <Clock className="w-6 h-6 text-amber-500 mb-2" />
        <div className="text-xl font-bold text-amber-600">
          {todayStats.pending}
        </div>
        <div className="text-xs text-muted-foreground">Pendientes</div>
      </CardContent>
    </Card>

    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center h-full p-4">
        <X className="w-6 h-6 text-red-500 mb-2" />
        <div className="text-xl font-bold text-red-600">
          {todayStats.cancelled}
        </div>
        <div className="text-xs text-muted-foreground">Cancelados</div>
      </CardContent>
    </Card>
  </div>
</div>

      {/* Próximo turno */}
      <Card className="shadow-lg border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <ArrowRight className="w-5 h-5 text-primary" />
            Próximo turno
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nextAppointment ? (
            <>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-sm">{nextAppointment.paciente}</p>
                  <p className="text-xs text-muted-foreground capitalize">{nextAppointment.tipo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-sm">{nextAppointment.hora}</p>
                  <p className="text-xs text-muted-foreground">{nextAppointment.fecha}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-2">
              No tienes turnos programados.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-all border-border">
            <CardHeader className="flex flex-col items-center pb-3">
              <CalendarDays className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-base font-semibold">Agenda</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0">
              <Button variant="default" className="w-full text-sm" size="sm">
                Ver agenda
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all border-border">
            <CardHeader className="flex flex-col items-center pb-3">
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-base font-semibold">Pacientes</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0">
              <Button variant="default" className="w-full text-sm" size="sm">
                Ver pacientes
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all border-border">
            <CardHeader className="flex flex-col items-center pb-3">
              <Clock className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-base font-semibold">Horarios</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0">
              <Button variant="default" className="w-full text-sm" size="sm">
                Gestionar horarios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
