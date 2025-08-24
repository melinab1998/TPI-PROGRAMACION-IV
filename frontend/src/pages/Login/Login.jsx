import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login con:", formData)
    // Aquí deberías llamar a tu backend para autenticar
  }

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-4">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                placeholder="Ingrese el email..."
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-2 border-[#2CD4D4] focus:ring-0 focus:outline-none focus:border-[#2CD4D4]"
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-4">Contraseña</Label>
              <Input
                id="password"
                name="password"
                placeholder="Ingrese la contraseña..."
                type="password"
                value={formData.password}
                onChange={handleChange}
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
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-accent-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className=" hover:underline">
              Regístrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
