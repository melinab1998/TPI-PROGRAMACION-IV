import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();         
    navigate("/");    
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Iniciar sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="mb-4">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="Ingrese el email..." required />
            </div>

            <div>
              <Label htmlFor="password" className="mb-4">Contraseña</Label>
              <Input id="password" name="password" type="password" placeholder="Ingrese la contraseña..." required />
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="h-4 w-4 border-gray-300 rounded" />
                <label htmlFor="remember" className="text-sm">Recordar contraseña</label>
              </div>
              <Link to="/forgot-password" className="text-sm hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>

            <Button type="submit" className="w-full">Ingresar</Button>
          </form>

          <div className="text-center text-sm mt-4">
            ¿No tienes cuenta? <Link to="/register" className="hover:underline">Regístrate</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
