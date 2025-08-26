import React from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full border-t bg-card mt-20">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contacto</h3>
                        <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>(123) 456-7890</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>contacto@clinica.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>Av. Principal 123, Ciudad</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Enlaces rápidos</h3>
                        <div className="space-y-2">
                            {["Inicio", "Servicios", "Equipo médico", "Contacto"].map((link, i) => (
                                <p key={i} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                    {link}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Horario de atención</h3>
                        <div className="text-muted-foreground space-y-2">
                            <div className="flex justify-between"><span>Lunes</span><span>14:00 - 20:00</span></div>
                            <div className="flex justify-between"><span>Miércoles</span><span>9:00 - 20:00</span></div>
                            <div className="flex justify-between"><span>Jueves</span><span>9:00 - 20:00</span></div>

                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                        </div>
                        <p className="text-sm text-muted-foreground text-center md:text-right">
                            © {new Date().getFullYear()} Turnando. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

