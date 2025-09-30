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
      <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={theme === "dark" ? logoDark : logoLight}
            alt="Logo clínica"
            className="h-12 w-auto mt-1 mb-1 filter-none"
          />
          <span
            className="hidden md:inline text-lg font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--primary) 0%, #00baba 50%, var(--primary) 100%)",
            }}
          >
            TURNANDO
          </span>
        </div>

        <div className="flex gap-4 items-center">
          <Link to="/"><Button variant="ghost">Inicio</Button></Link>

          {isLoggedIn ? (
            <>
              {role === "user" && (
                <>
                  <Link to="/appointments"><Button variant="ghost">Turnos</Button></Link>
                  <Link to="/profile"><Button variant="ghost">Mi Perfil</Button></Link>
                </>
              )}

              {role === "admin" && (
                <>
                  <Link to="/schedule"><Button variant="ghost">Agenda</Button></Link>
                  <Link to="/patients"><Button variant="ghost">Pacientes</Button></Link>
                  <Link to="/visit-record"><Button variant="ghost">Visitas</Button></Link>
                  <Link to="/availability"><Button variant="ghost">Horarios</Button></Link>
                </>
              )}

              {role === "superadmin" && (
                <>
                  <Link to="/super-panel"><Button variant="ghost">Panel Root</Button></Link>
                  <Link to="/system-config"><Button variant="ghost">Config Sistema</Button></Link>
                </>
              )}

              <Button variant="outline" className="hidden md:inline" onClick={logout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/services"><Button variant="ghost">Servicios</Button></Link>
              <Link to="/contact"><Button variant="ghost">Contacto</Button></Link>
              <Link to="/login">
                <Button variant="outline" className="hidden md:inline">
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
