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
    <div className="px-4 sm:px-6 lg:px-8 py-10 space-y-10 max-w-6xl mx-auto">
      <header className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-primary tracking-tight mb-2.5">
          ¡Bienvenida, {dentistName}!
        </h1>
        <p className="text-base text-muted-foreground">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <Calendar className="w-8 h-8 text-primary mb-3" />
              <div className="text-2xl font-bold text-primary">
                {todayStats.total}
              </div>
              <div className="text-sm text-muted-foreground">Turnos hoy</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <Clock className="w-8 h-8 text-amber-500 mb-3" />
              <div className="text-2xl font-bold text-amber-600">
                {todayStats.pending}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <X className="w-8 h-8 text-red-500 mb-3" />
              <div className="text-2xl font-bold text-red-600">
                {todayStats.cancelled}
              </div>
              <div className="text-sm text-muted-foreground">Cancelados</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="shadow-lg border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <ArrowRight className="w-6 h-6 text-primary" />
            Próximo turno
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextAppointment ? (
            <>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-base">{nextAppointment.paciente}</p>
                  <p className="text-sm text-muted-foreground capitalize">{nextAppointment.tipo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-base">{nextAppointment.hora}</p>
                  <p className="text-sm text-muted-foreground">{nextAppointment.fecha}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-base text-center py-3">
              No tienes turnos programados.
            </p>
          )}
        </CardContent>
      </Card>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Card className="shadow-md hover:shadow-lg transition-all border">
            <CardHeader className="flex flex-col items-center pb-2 px-4 mt-5">
              <CalendarDays className="w-8 h-8 sm:w-8 sm:h-8 text-primary mb-1" />
              <CardTitle className="text-sm sm:text-base font-semibold text-center">Agenda</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0 px-4">
              <Button variant="default" className="w-full text-xs sm:text-sm" size="default">
                Ver agenda
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all border">
            <CardHeader className="flex flex-col items-center pb-2 px-4 mt-5">
              <Users className="w-8 h-8 sm:w-8 sm:h-8 text-primary mb-1" />
              <CardTitle className="text-sm sm:text-base font-semibold text-center">Pacientes</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0 px-4">
              <Button variant="default" className="w-full text-xs sm:text-sm" size="default">
                Ver pacientes
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all border">
            <CardHeader className="flex flex-col items-center pb-2 px-4 mt-5">
              <Clock className="w-8 h-8 sm:w-8 sm:h-8 text-primary mb-1" />
              <CardTitle className="text-sm sm:text-base font-semibold text-center">Horarios</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0 px-6">
              <Button variant="default" className="w-full text-xs sm:text-sm" size="default">
                Gestionar horarios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

