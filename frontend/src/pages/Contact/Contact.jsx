import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, User } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen py-10 mt-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Contáctanos</h1>
                    <p className="text-lg max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                        Estamos aquí para responder cualquier pregunta sobre nuestros servicios dentales.
                        Agenda tu cita o solicita más información.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <Card className="h-full shadow-lg rounded-xl border-0 p-0 overflow-hidden">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-semibold tracking-tight whitespace-nowrap">Información de contacto</h2>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors">
                                <div className="bg-primary/10 p-3 rounded-full mt-1">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Teléfono</p>
                                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors">
                                <div className="bg-primary/10 p-3 rounded-full mt-1">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-muted-foreground">contacto@clinicadental.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors">
                                <div className="bg-primary/10 p-3 rounded-full mt-1">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Dirección</p>
                                    <p className="text-muted-foreground">Av. Principal #123, Ciudad, Estado 12345</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors">
                                <div className="bg-primary/10 p-3 rounded-full mt-1">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Horario de atención</p>
                                    <p className="text-muted-foreground">
                                        Lunes a Viernes: 9:00 - 18:00<br />Sábados: 9:00 - 14:00
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 h-full flex flex-col shadow-lg rounded-xl border-0 p-0 overflow-hidden">
                        <CardContent className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-semibold tracking-tight">Envía un mensaje</h2>
                            </div>

                            <form className="space-y-6 flex-1 flex flex-col">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-base">Nombre completo</Label>
                                        <Input id="name" placeholder="Tu nombre completo" className="py-4 px-4 w-full" />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-base">Correo electrónico</Label>
                                        <Input id="email" type="email" placeholder="tu.email@ejemplo.com" className="py-4 px-4 w-full" />
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1">
                                    <Label htmlFor="message" className="text-base">Mensaje</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Cuéntanos cómo podemos ayudarte..."
                                        className="min-h-[180px] resize-none p-4 w-full"
                                    />
                                </div>

                                <Button type="submit" className="w-full py-5.5 text-base font-medium mt-2 gap-2">
                                    <Send className="w-5 h-5" />
                                    Enviar mensaje
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card className="w-full shadow-lg rounded-xl overflow-hidden border-0 p-0">
                    <CardContent className="p-0">
                        <div className="px-8 pt-8 pb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-semibold tracking-tight">Nuestra ubicación</h2>
                            </div>
                        </div>
                        <div className="w-full h-[450px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.867833525148!2d-60.64639392435128!3d-32.95449867228515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab11d0eb49c3%3A0x11f1d3d54f950dd0!2sUniversidad%20Tecnol%C3%B3gica%20Nacional%20%7C%20Facultad%20Regional%20Rosario!5e0!3m2!1ses!2sar!4v1756423268335!5m2!1ses!2sar"
                                className="w-full h-full"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Contact;
