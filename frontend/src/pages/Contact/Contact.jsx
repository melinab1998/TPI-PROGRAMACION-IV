import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const Contact = () => {
    return (
        <div className="min-h-screen py-10 mt-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Contáctanos</h1>
                    <p className="text-lg max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                        Estamos aquí para responder cualquier pregunta sobre nuestros servicios dentales.
                        Agenda tu cita o solicita más información.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={cardVariants}>
                        <Card className="h-full shadow-lg rounded-xl border-0 p-0 overflow-hidden">
                            <CardContent className="p-8 space-y-6">
                                <motion.div className="flex items-center gap-2 mb-4" variants={itemVariants}>
                                    <User className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-semibold tracking-tight whitespace-nowrap">
                                        Información de contacto
                                    </h2>
                                </motion.div>

                                {[
                                    { icon: <Phone className="w-5 h-5 text-primary" />, title: "Teléfono", value: "+1 (555) 123-4567" },
                                    { icon: <Mail className="w-5 h-5 text-primary" />, title: "Email", value: "contacto@clinicadental.com" },
                                    { icon: <MapPin className="w-5 h-5 text-primary" />, title: "Dirección", value: "Av. Principal #123, Ciudad, Estado 12345" },
                                    { icon: <Clock className="w-5 h-5 text-primary" />, title: "Horario de atención", value: "Lunes a Viernes: 9:00 - 18:00\nSábados: 9:00 - 14:00" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors whitespace-pre-line"
                                        variants={itemVariants}
                                    >
                                        <div className="bg-primary/10 p-3 rounded-full mt-1">{item.icon}</div>
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-muted-foreground">{item.value}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div className="lg:col-span-2" variants={cardVariants}>
                        <Card className="h-full flex flex-col shadow-lg rounded-xl border-0 p-0 overflow-hidden">
                            <CardContent className="p-8 flex-1 flex flex-col">
                                <motion.div className="flex items-center gap-2 mb-6" variants={itemVariants}>
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-semibold tracking-tight">Envía un mensaje</h2>
                                </motion.div>

                                <motion.form className="space-y-6 flex-1 flex flex-col" variants={containerVariants}>
                                    <motion.div className="space-y-6" variants={itemVariants}>
                                        <motion.div className="space-y-3" variants={itemVariants}>
                                            <Label htmlFor="name" className="text-base">Nombre completo</Label>
                                            <Input id="name" placeholder="Tu nombre completo" className="py-4 px-4 w-full" />
                                        </motion.div>

                                        <motion.div className="space-y-3" variants={itemVariants}>
                                            <Label htmlFor="email" className="text-base">Correo electrónico</Label>
                                            <Input id="email" type="email" placeholder="tu.email@ejemplo.com" className="py-4 px-4 w-full" />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div className="space-y-3 flex-1" variants={itemVariants}>
                                        <Label htmlFor="message" className="text-base">Mensaje</Label>
                                        <Textarea id="message" placeholder="Cuéntanos cómo podemos ayudarte..." className="min-h-[180px] resize-none p-4 w-full" />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <Button type="submit" className="w-full py-5.5 text-base font-medium mt-2 gap-2">
                                            <Send className="w-5 h-5" />
                                            Enviar mensaje
                                        </Button>
                                    </motion.div>
                                </motion.form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Card className="w-full shadow-lg rounded-xl overflow-hidden border-0 p-0">
                        <CardContent className="p-0">
                            <div className="px-8 pt-8 pb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-semibold tracking-tight">Nuestra ubicación</h2>
                                </div>
                            </div>
                            <motion.div
                                className="w-full h-[450px]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.7 }}
                            >
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.867833525148!2d-60.64639392435128!3d-32.95449867228515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab11d0eb49c3%3A0x11f1d3d54f950dd0!2sUniversidad%20Tecnol%C3%B3gica%20Nacional%20%7C%20Facultad%20Regional%20Rosario!5e0!3m2!1ses!2sar!4v1756423268335!5m2!1ses!2sar"
                                    className="w-full h-full"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
