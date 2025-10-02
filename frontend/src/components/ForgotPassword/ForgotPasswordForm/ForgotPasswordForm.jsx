import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPassword() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        console.log('Email enviado:', email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Recuperar Contraseña
                    </CardTitle>
                    <CardDescription className="text-center">
                        Por favor, ingresa tu correo electrónico para recibir instrucciones sobre cómo restablecer tu contraseña.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Ingresa tu correo electrónico"
                                required
                            />
                        </div>
                        
                        <Button type="submit" className="w-full">
                            Enviar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}