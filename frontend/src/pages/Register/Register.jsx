import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Mail, CreditCard, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-xl mt-16 p-8">
            <CardHeader className="space-y-2 pb-4">
                <CardTitle className="text-3xl font-bold text-center">
                    Crear cuenta
                </CardTitle>
                <CardDescription className="text-center text-base">
                    Completa tus datos para registrarte en nuestra plataforma
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Columna izquierda */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-sm font-medium">
                                Nombre
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="nombre"
                                    type="text"
                                    placeholder="Juan"
                                    className="pl-10 py-2.5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apellido" className="text-sm font-medium">
                                Apellido
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="apellido"
                                    type="text"
                                    placeholder="Pérez"
                                    className="pl-10 py-2.5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dni" className="text-sm font-medium">
                                DNI
                            </Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="dni"
                                    type="text"
                                    placeholder="12345678"
                                    className="pl-10 py-2.5"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ejemplo@email.com"
                                    className="pl-10 py-2.5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="pl-10 pr-10 py-2.5"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirmar contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="pl-10 pr-10 py-2.5"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                        {showConfirmPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 pt-2">
                        <Button type="submit" className="w-full py-2.5 text-base">
                            Registrarse
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm mt-5 pt-4 border-t">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login">
                        <Button variant="link" className="p-0 font-medium">
                            Inicia sesión
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}