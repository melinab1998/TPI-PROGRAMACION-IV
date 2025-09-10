import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Calendar, User, Clock, History, ArrowRight, Sparkles } from "lucide-react";

const UserHome = () => {
    const userData = {
        name: "María Gomez",
        nextAppointment: {
            date: "15 de Septiembre, 2024",
            time: "10:30 AM",
            dentist: "Dr. Juan Pérez",
        },
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
                <div className="text-center space-y-4 relative">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        ¡Bienvenida, {userData.name}!
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Gestiona tus turnos odontológicos de manera sencilla y rápida
                    </p>
                </div>
                <section className="space-y-5">
                    <div className="ml-5">
                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                            Tu próximo turno
                        </h2>
                        <p className="text-muted-foreground">Revisa los detalles de tu próxima visita</p>
                    </div>

                    {userData.nextAppointment ? (
                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-primary/15 p-4 rounded-full shrink-0">
                                    <Calendar className="h-8 w-8 text-primary" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <p className="font-semibold text-lg text-foreground">{userData.nextAppointment.date}</p>
                                    <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                                        <span className="inline-flex items-center px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                                            <Clock className="h-4 w-4 mr-1.5" /> {userData.nextAppointment.time}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                                            <User className="h-4 w-4 mr-1.5" /> {userData.nextAppointment.dentist}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                                    <Button variant="outline" size="sm" className="min-w-[100px]">
                                        Ver detalles
                                    </Button>
                                    <Button variant="destructive" size="sm" className="min-w-[100px]">
                                        Cancelar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="shadow-lg text-center py-10">
                            <CardContent className="space-y-4">
                                <div className="bg-muted/50 p-4 rounded-full inline-flex">
                                    <Calendar className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">No tienes turnos programados</p>
                                <Button asChild size="lg" className="mt-2">
                                    <Link to="/appointments" className="flex items-center">
                                        Sacar mi primer turno <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </section>
                <section className="space-y-6">
                    <div className="ml-5">
                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                            ¿Qué necesitas hacer hoy?
                        </h2>
                        <p className="text-muted-foreground">Accede rápidamente a las funciones principales</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors group-hover:rotate-12">
                                    <Calendar className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-lg font-semibold">Sacar turno</CardTitle>
                                <CardDescription className="text-muted-foreground text-sm px-2">
                                    Reserva una nueva cita con nuestros especialistas
                                </CardDescription>
                                <Button asChild variant="ghost" size="sm" className="mt-2 group-hover:text-primary transition-colors">
                                    <Link to="/appointments" className="flex items-center">
                                        Reservar ahora <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors group-hover:rotate-12">
                                    <History className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-lg font-semibold">Historial</CardTitle>
                                <CardDescription className="text-muted-foreground text-sm px-2">
                                    Revisa tu historial de visitas y tratamientos
                                </CardDescription>
                                <Button asChild variant="ghost" size="sm" className="mt-2 group-hover:text-primary transition-colors">
                                    <Link to="/history" className="flex items-center">
                                        Ver historial <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors group-hover:rotate-12">
                                    <User className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-lg font-semibold">Mi perfil</CardTitle>
                                <CardDescription className="text-muted-foreground text-sm px-2">
                                    Gestiona tu información personal y preferencias
                                </CardDescription>
                                <Button asChild variant="ghost" size="sm" className="mt-2 group-hover:text-primary transition-colors">
                                    <Link to="/profile" className="flex items-center">
                                        Editar perfil <ArrowRight className="ml-2 h-4 w-4" />
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