import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-4">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="Ingrese el email..."
                type="email"
                required
                className="border-2 border-[#2CD4D4] focus:ring-0 focus:outline-none focus:border-[#2CD4D4]"
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-4">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                placeholder="Ingrese la contraseña..."
                type="password"
                required
                className="border-2 border-[#2CD4D4] focus:ring-0 focus:outline-none focus:border-[#2CD4D4]"
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-accent-foreground hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Checkbox Recordar contraseña */}
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label htmlFor="remember" className="text-sm text-accent-foreground">
                Recordar contraseña
              </label>
            </div>

            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-accent-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="hover:underline">
              Regístrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
