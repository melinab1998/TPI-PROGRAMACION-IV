import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        password: '',
        confirm_password: ''
    });

    const handleData = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Contraseña cambiada:', formData);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Restablecer Contraseña
                    </CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tu nueva contraseña.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nueva Contraseña</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleData}
                                placeholder="Nueva contraseña"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirmar Contraseña</Label>
                            <Input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleData}
                                placeholder="Confirmar contraseña"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Cambiar contraseña
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}