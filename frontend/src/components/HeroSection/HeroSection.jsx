import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Phone, Heart, ShieldCheck, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden py-35">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-background/80 z-0" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl text-center mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Descubre la sonrisa
                        </span>
                        <br />
                        que siempre quisiste
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                        Tu salud bucal en las mejores manos. Reserva tu turno online de forma
                        rápida y sencilla para cuidar tu sonrisa con atención profesional.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="px-8 py-6 text-lg font-semibold">
                            <ClipboardCheck className="mr-2 h-5 w-5" />
                            Agendar Turno
                        </Button>
                        <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                            <Phone className="mr-2 h-5 w-5" />
                            Llamar ahora
                        </Button>
                    </div>
                </motion.div>

                <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                    {[
                        { icon: <ShieldCheck className="h-8 w-8 mx-auto text-primary" />, text: "Seguridad" },
                        { icon: <Award className="h-8 w-8 mx-auto text-primary" />, text: "Experiencia" },
                        { icon: <Heart className="h-8 w-8 mx-auto text-primary" />, text: "Cuidado" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.2 + 0.8 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                                {item.icon}
                            </div>
                            <p className="text-sm font-medium w-full px-2">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
