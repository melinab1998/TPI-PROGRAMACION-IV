import React from "react";
import { Button } from "@/components/ui/button";
import logoLight from "@/img/logo-light-1.png";
import logoDark from "@/img/logo-dark-1.png";
import ModeToggle from "@/components/ui/mode-toggle";
import { useTheme } from "next-themes";

export default function NavBar() {

    const { theme } = useTheme();

    return (
        <nav className="w-full border-b border-[var(--border)] bg-[var(--card)]">
            <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img
                        src={theme === "dark" ? logoDark : logoLight}
                        alt="Logo clínica"
                        className="h-12 w-auto mt-1.5 mb-1.5 filter-none"
                    />
                    <span className="hidden md:inline text-lg font-bold text-[var(--primary)]">
                        STURN
                    </span>
                </div>
                <div className="flex gap-4 items-center">
                    <Button variant="ghost">Inicio</Button>
                    <Button variant="ghost">Servicios</Button>
                    <Button variant="ghost">Contacto</Button>
                    <Button variant="outline" className="hidden md:inline">
                        Iniciar sesión
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
