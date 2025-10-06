import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { successToast } from "@/utils/notifications";

export default function ResetPassword() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    const password = watch("password");

    const onSubmit = (data) => {
        console.log("Contraseña cambiada:", data);
        successToast("Contraseña actualizada con éxito");

        // Limpiamos el formulario
        reset();

        // Redirigimos al login después de un pequeño delay para que se vea el toast
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    };

    const inputVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.3 },
        }),
    };

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
                            Restablecer Contraseña
                        </CardTitle>
                        <CardDescription className="text-center">
                            Ingresa tu nueva contraseña.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <motion.form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Contraseña */}
                            <motion.div className="space-y-2" custom={0} variants={inputVariants}>
                                <Label htmlFor="password">Nueva Contraseña</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    placeholder="Nueva contraseña"
                                    {...register("password", {
                                        required: "La contraseña es obligatoria",
                                        minLength: {
                                            value: 8,
                                            message: "Debe tener al menos 8 caracteres",
                                        },
                                        pattern: {
                                            value: /^(?=.*[A-Z]).+$/,
                                            message: "Debe contener al menos una mayúscula",
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </motion.div>

                            {/* Confirmar contraseña */}
                            <motion.div className="space-y-2" custom={1} variants={inputVariants}>
                                <Label htmlFor="confirm_password">Confirmar Contraseña</Label>
                                <Input
                                    type="password"
                                    id="confirm_password"
                                    placeholder="Confirmar contraseña"
                                    {...register("confirm_password", {
                                        required: "Debe confirmar la contraseña",
                                        validate: (value) =>
                                            value === password || "Las contraseñas no coinciden",
                                    })}
                                />
                                {errors.confirm_password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.confirm_password.message}
                                    </p>
                                )}
                            </motion.div>

                            <motion.div custom={2} variants={inputVariants}>
                                <Button type="submit" className="w-full">
                                    Cambiar contraseña
                                </Button>
                            </motion.div>
                        </motion.form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

