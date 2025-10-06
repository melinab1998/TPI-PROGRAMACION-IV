import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import logoLight from "@/img/logo-light-1.png";
import logoDark from "@/img/logo-dark-1.png";
import ModeToggle from "@/components/ui/mode-toggle";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function NavBar() {
  const { theme } = useTheme();
  const { isLoggedIn, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  const renderMobileMenu = () => (
    <div className="flex flex-col items-center text-center space-y-4 mt-8">
      <div className="flex flex-col items-center mb-4">
        <img
          src={theme === "dark" ? logoDark : logoLight}
          alt="Logo clínica"
          className="h-12 w-auto mb-2"
        />
        <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent tracking-tight">
          Turnando
        </span>
      </div>
      <Link to="/" onClick={closeSheet} className="w-full">
        <Button variant="ghost" className="w-full justify-center text-base font-medium">
          {role === "superadmin" ? "Gestión" : "Inicio"}
        </Button>
      </Link>

      {isLoggedIn ? (
        <>
          {role === "user" && (
            <>
              <Link to="/appointments" onClick={closeSheet} className="w-full">
                <Button variant="ghost" className="w-full justify-center text-base font-medium">
                  Turnos
                </Button>
              </Link>
              <Link to="/profile" onClick={closeSheet} className="w-full">
                <Button variant="ghost" className="w-full justify-center text-base font-medium">
                  Mi Perfil
                </Button>
              </Link>
            </>
          )}
          {role === "admin" && (
            <>
              <Link to="/schedule" onClick={closeSheet} className="w-full">
                <Button variant="ghost" className="w-full justify-center text-base font-medium">
                  Agenda
                </Button>
              </Link>
              <Link to="/patients" onClick={closeSheet} className="w-full">
                <Button variant="ghost" className="w-full justify-center text-base font-medium">
                  Pacientes
                </Button>
              </Link>
              <Link to="/visit-record" onClick={closeSheet} className="w-full">
                <Button variant="ghost" className="w-full justify-center text-base font-medium">
                  Visitas
                </Button>
              </Link>
              <Link to="/availability" onClick={closeSheet} className="w-full">
                <Button variant="ghost" className="w-full justify-center text-base font-medium">
                  Horarios
                </Button>
              </Link>
            </>
          )}
          <Button
            variant="outline"
            className="w-full justify-center text-base font-medium mt-2"
            onClick={() => {
              closeSheet();
              logout();
            }}
          >
            Cerrar sesión
          </Button>
        </>
      ) : (
        <>
          <Link to="/services" onClick={closeSheet} className="w-full">
            <Button variant="ghost" className="w-full justify-center text-base font-medium">
              Servicios
            </Button>
          </Link>
          <Link to="/contact" onClick={closeSheet} className="w-full">
            <Button variant="ghost" className="w-full justify-center text-base font-medium">
              Contacto
            </Button>
          </Link>
          <Link to="/login" onClick={closeSheet} className="w-full">
            <Button variant="outline" className="w-full justify-center text-base font-medium mt-2">
              Iniciar sesión
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="w-full border-b border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={theme === "dark" ? logoDark : logoLight}
            alt="Logo clínica"
            className="h-12 w-auto"
          />
          <span className="hidden md:inline text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent tracking-tight">
            Turnando
          </span>
        </div>
        <div className="hidden md:flex gap-3 items-center">
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
              <Button
                variant="outline"
                size="default"
                onClick={logout}
                className="text-sm font-medium"
              >
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
        <div className="flex md:hidden gap-3 items-center">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              {renderMobileMenu()}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
