import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Mail, CreditCard, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { successToast } from "@/utils/notifications";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    const password = watch("password");

    const fieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const onSubmit = (data) => {
        console.log(data);
        successToast("¡Registro exitoso!");
        reset();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
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
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit(onSubmit)}>
                        <motion.div
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                            transition={{ staggerChildren: 0.1 }}
                        >
                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="nombre" className="text-sm font-medium">Nombre</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("nombre", { required: "El nombre es obligatorio" })}
                                        id="nombre"
                                        type="text"
                                        placeholder="Juan"
                                        className="pl-10 py-2.5 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
                            </motion.div>
                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="apellido" className="text-sm font-medium">Apellido</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("apellido", { required: "El apellido es obligatorio" })}
                                        id="apellido"
                                        type="text"
                                        placeholder="Pérez"
                                        className="pl-10 py-2.5 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido.message}</p>}
                            </motion.div>
                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="dni" className="text-sm font-medium">DNI</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("dni", {
                                            required: "El DNI es obligatorio",
                                            pattern: { value: /^\d{7,8}$/, message: "DNI inválido" }
                                        })}
                                        id="dni"
                                        type="text"
                                        placeholder="12345678"
                                        className="pl-10 py-2.5 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                {errors.dni && <p className="text-red-500 text-sm">{errors.dni.message}</p>}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                        >
                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("email", {
                                            required: "El email es obligatorio",
                                            pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }
                                        })}
                                        id="email"
                                        type="email"
                                        placeholder="ejemplo@email.com"
                                        className="pl-10 py-2.5 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </motion.div>
                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("password", {
                                            required: "La contraseña es obligatoria",
                                            minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                                            validate: value => /[A-Z]/.test(value) || "Debe contener una mayúscula"
                                        })}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="pl-10 pr-10 py-2.5 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </motion.div>
                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("confirmPassword", {
                                            required: "Confirma tu contraseña",
                                            validate: value => value === password || "Las contraseñas no coinciden"
                                        })}
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="pl-10 pr-10 py-2.5 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            variants={fieldVariants}
                            className="md:col-span-2 pt-2"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button type="submit" className="w-full py-2.5 text-base">
                                Registrarse
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center text-sm mt-5 pt-4 border-t"
                    >
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/login">
                            <Button variant="link" className="p-0 font-medium">
                                Inicia sesión
                            </Button>
                        </Link>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
