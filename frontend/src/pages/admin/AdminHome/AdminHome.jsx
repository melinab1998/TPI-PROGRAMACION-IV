import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, Clock, User, FileText, ArrowRight, X, Rocket, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "@/components/common/Header/Header"

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

  const quickActions = [
    { title: "Agenda", description: "Gestionar turnos", icon: CalendarDays, href: "/schedule" },
    { title: "Pacientes", description: "Ver lista de pacientes", icon: Users, href: "/patients" },
    { title: "Visitas", description: "Registrar consultas", icon: FileText, href: "/visit-record" },
    { title: "Horarios", description: "Configurar disponibilidad", icon: Clock, href: "/availability" }
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  const actionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.3 } })
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 space-y-10 max-w-6xl mx-auto">
      <motion.div
        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
        initial="hidden"
        animate="visible"
      >
        <Header
          title={`¡Bienvenida, ${dentistName}!`}
          subtitle={new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        />
      </motion.div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <CalendarDays className="w-8 h-8 text-primary mb-3" />
                <div className="text-2xl font-bold text-primary">{todayStats.total}</div>
                <div className="text-sm text-muted-foreground">Turnos hoy</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <Clock className="w-8 h-8 text-amber-500 mb-3" />
                <div className="text-2xl font-bold text-amber-600">{todayStats.pending}</div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <X className="w-8 h-8 text-red-500 mb-3" />
                <div className="text-2xl font-bold text-red-600">{todayStats.cancelled}</div>
                <div className="text-sm text-muted-foreground">Cancelados</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="shadow-lg min-h-[260px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <ArrowRight className="w-6 h-6 text-primary" />
                Próximo turno
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-6 flex flex-col justify-between">
              {nextAppointment ? (
                <>
                  <div className="space-y-4">
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
                  </div>
                  <div className="pt-4 border-t">
                    <Link to="/schedule">
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" /> Ver Agenda Completa
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex flex-col flex-1 items-center justify-center text-center">
                  <CalendarDays className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground text-base mb-4">
                    No tienes turnos programados
                  </p>
                  <Link to="/schedule">
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Crear Primer Turno
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <Card className="shadow-lg min-h-[260px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Rocket className="w-6 h-6 text-primary" />
                Accesos Rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={actionVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link to={action.href} className="block">
                      <div className="p-4 text-center bg-muted/20 hover:bg-muted/40 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
                        <div className="p-2 bg-primary/10 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                          <action.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
