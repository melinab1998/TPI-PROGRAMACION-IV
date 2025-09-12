import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Calendar, User, Clock, History, ArrowRight, Sparkles, CalendarClock } from "lucide-react";

const UserHome = () => {
    const userData = {
        name: "María Gomez",
        nextAppointment: {
            date: "15 de Septiembre, 2024",
            time: "10:30 AM",
            dentist: "Dr. Juan Pérez",
            treatment: "Limpieza dental y revisión"
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 relative z-10">
                <div className="text-center space-y-6 relative">
                    <div className="pt-10">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                            ¡Hola, <span className="text-primary">{userData.name}</span>!
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
                            Gestiona tus turnos odontológicos con nuestra plataforma especializada
                        </p>
                    </div>
                </div>
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <CalendarClock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">
                                Tu próximo turno
                            </h2>
                            <p className="text-muted-foreground">Revisa los detalles de tu próxima visita</p>
                        </div>
                    </div>

                    {userData.nextAppointment ? (
                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/3 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            <CardContent className="p-8 relative flex flex-col md:flex-row items-center gap-8 z-10">
                                <div className="bg-gradient-to-br from-primary to-primary/80 p-5 rounded-full shrink-0 shadow-md">
                                    <Calendar className="h-10 w-10 text-white" />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <p className="font-bold text-2xl text-foreground">{userData.nextAppointment.date}</p>
                                    <p className="text-muted-foreground mt-2">{userData.nextAppointment.treatment}</p>

                                    <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                                        <span className="inline-flex items-center px-4 py-2 text-sm rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                                            <Clock className="h-4 w-4 mr-2" /> {userData.nextAppointment.time}
                                        </span>
                                        <span className="inline-flex items-center px-4 py-2 text-sm rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                                            <User className="h-4 w-4 mr-2" /> {userData.nextAppointment.dentist}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col  gap-4 p-5 shrink-0">
                                    <Button
                                        size="sm"
                                        className="min-w-[120px] h-9 gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-all duration-200 group shadow-sm"
                                    >
                                        <span>Cancelar</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="shadow-lg text-center py-12 border-border/50 bg-gradient-to-br from-background to-muted/30 relative">
                            <CardContent className="space-y-6">
                                <div className="bg-muted/50 p-5 rounded-full inline-flex border border-border/30">
                                    <Calendar className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-lg">No tienes turnos programados</p>
                                    <p className="text-muted-foreground/70 text-sm mt-1">Reserva tu primera cita con nuestros especialistas</p>
                                </div>
                                <Button asChild size="lg" className="mt-2 gap-2 bg-primary hover:bg-primary/90">
                                    <Link to="/appointments" className="flex items-center">
                                        <Sparkles className="h-4 w-4" />
                                        <span>Sacar mi primer turno</span>
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </section>
                <section className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">
                                Acciones rápidas
                            </h2>
                            <p className="text-muted-foreground">Accede rápidamente a las funciones principales</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-background to-muted/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            <CardContent className="p-6 relative flex flex-col items-center text-center space-y-5 z-10">
                                <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md">
                                    <Calendar className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-lg font-semibold text-foreground">Sacar turno</CardTitle>
                                <CardDescription className="text-muted-foreground text-sm px-2">
                                    Reserva una nueva cita con nuestros especialistas
                                </CardDescription>
                                <Button asChild variant="ghost" size="sm" className="mt-2 group-hover:text-primary transition-colors gap-2">
                                    <Link to="/appointments" className="flex items-center">
                                        <span>Reservar ahora</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-background to-muted/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            <CardContent className="p-6 relative flex flex-col items-center text-center space-y-5 z-10">
                                <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md">
                                    <History className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-lg font-semibold text-foreground">Historial</CardTitle>
                                <CardDescription className="text-muted-foreground text-sm px-2">
                                    Revisa tu historial de visitas y tratamientos
                                </CardDescription>
                                <Button asChild variant="ghost" size="sm" className="mt-2 group-hover:text-primary transition-colors gap-2">
                                    <Link to="/profile" className="flex items-center">
                                        <span>Ver historial</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-background to-muted/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            <CardContent className="p-6 relative flex flex-col items-center text-center space-y-5 z-10">
                                <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md">
                                    <User className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-lg font-semibold text-foreground">Mi perfil</CardTitle>
                                <CardDescription className="text-muted-foreground text-sm px-2">
                                    Gestiona tu información personal y preferencias
                                </CardDescription>
                                <Button asChild variant="ghost" size="sm" className="mt-2 group-hover:text-primary transition-colors gap-2">
                                    <Link to="/profile" className="flex items-center">
                                        <span>Editar perfil</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserHome;