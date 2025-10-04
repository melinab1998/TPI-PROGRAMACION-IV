import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export default function ForgotPassword() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        console.log('Email enviado:', email);
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
    }

    const inputVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.3 }
        })
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Recuperar Contraseña
                        </CardTitle>
                        <CardDescription className="text-center">
                            Por favor, ingresa tu correo electrónico para recibir instrucciones sobre cómo restablecer tu contraseña.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="space-y-2"
                                custom={0}
                                variants={inputVariants}
                            >
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Ingresa tu correo electrónico"
                                    required
                                />
                            </motion.div>

                            <motion.div custom={1} variants={inputVariants}>
                                <Button type="submit" className="w-full">
                                    Enviar
                                </Button>
                            </motion.div>
                        </motion.form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
