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
            Iniciar sesión
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

            <div className="flex justify-between items-center py-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="text-sm">
                  Recordar contraseña
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            ¿No tienes cuenta?{" "}
            <Button variant="link" className="p-0">
              <Link to="/register">Regístrate</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
