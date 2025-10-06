import React from "react";
import { Button } from "@/components/ui/button";
import logoLight from "@/img/logo-light-1.png";
import logoDark from "@/img/logo-dark-1.png";
import ModeToggle from "@/components/ui/mode-toggle";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function NavBar() {
  const { theme } = useTheme();
  const { isLoggedIn, role, logout } = useAuth();

  return (
    <nav className="w-full border-b border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={theme === "dark" ? logoDark : logoLight}
            alt="Logo clínica"
            className="h-12 w-auto"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent tracking-tight">
            Turnando
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <Link to="/">
            <Button variant="ghost" size="default" className="text-sm font-medium">
              {role === "superadmin" ? "Gestión" : "Inicio"}
            </Button>
          </Link>

          {isLoggedIn ? (
            <>
              {role === "user" && (
                <>
                  <Link to="/appointments">
                    <Button variant="ghost" size="default" className="text-sm font-medium">
                      Turnos
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" size="default" className="text-sm font-medium">
                      Mi Perfil
                    </Button>
                  </Link>
                </>
              )}
              {role === "admin" && (
                <>
                  <Link to="/schedule">
                    <Button variant="ghost" size="default" className="text-sm font-medium">
                      Agenda
                    </Button>
                  </Link>
                  <Link to="/patients">
                    <Button variant="ghost" size="default" className="text-sm font-medium">
                      Pacientes
                    </Button>
                  </Link>
                  <Link to="/visit-record">
                    <Button variant="ghost" size="default" className="text-sm font-medium">
                      Visitas
                    </Button>
                  </Link>
                  <Link to="/availability">
                    <Button variant="ghost" size="default" className="text-sm font-medium">
                      Horarios
                    </Button>
                  </Link>
                </>
              )}
              <Button variant="outline" size="default" onClick={logout} className="text-sm font-medium">
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/services">
                <Button variant="ghost" size="default" className="text-sm font-medium">
                  Servicios
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" size="default" className="text-sm font-medium">
                  Contacto
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="default" className="text-sm font-medium">
                  Iniciar sesión
                </Button>
              </Link>
            </>
          )}

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
