import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { successToast, errorToast } from "@/utils/notifications";
import { resetPasswordValidations } from "@/utils/validations";
import { activateDentist, activatePatient } from "@/services/api.services";
import { jwtDecode } from "jwt-decode";

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
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    let userType = "patient"; 
    try {
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.dentistId) userType = "dentist";
            else if (decoded.patientId) userType = "patient";
        }
    } catch (err) {
        console.warn("Token inválido:", err);
    }

    const onSubmit = (data) => {
        if (!token) {
            errorToast("El enlace no es válido o ha expirado");
            return;
        }

        if (!data.password) {
            errorToast("Debes ingresar una contraseña");
            return;
        }

        const activateFn = userType === "dentist" ? activateDentist : activatePatient;

        activateFn(
            token,
            data.password,
            () => {
                console.log(`Cuenta activada (${userType})`);
                successToast("Cuenta activada correctamente 🎉");
                reset();
                setTimeout(() => navigate("/login"), 1200);
            },
            (err) => {
                const msg = err?.message || "Error al activar la cuenta";
                errorToast(msg);
            }
        );
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
            <motion.div initial="hidden" animate="visible" className="w-full max-w-md">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Activar Cuenta</CardTitle>
                        <CardDescription className="text-center">
                            Crea tu nueva contraseña para activar tu cuenta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <motion.form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div className="space-y-2" custom={0} variants={inputVariants}>
                                <Label htmlFor="password">Nueva Contraseña</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    placeholder="Nueva contraseña"
                                    {...register("password", resetPasswordValidations.password)}
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </motion.div>

                            <motion.div className="space-y-2" custom={1} variants={inputVariants}>
                                <Label htmlFor="confirm_password">Confirmar Contraseña</Label>
                                <Input
                                    type="password"
                                    id="confirm_password"
                                    placeholder="Confirmar contraseña"
                                    {...register("confirm_password", {
                                        ...resetPasswordValidations.confirm_password,
                                        validate: (value) => value === password || "Las contraseñas no coinciden",
                                    })}
                                />
                                {errors.confirm_password && (
                                    <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
                                )}
                            </motion.div>

                            <motion.div custom={2} variants={inputVariants}>
                                <Button type="submit" className="w-full">
                                    Activar Cuenta
                                </Button>
                            </motion.div>
                        </motion.form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
