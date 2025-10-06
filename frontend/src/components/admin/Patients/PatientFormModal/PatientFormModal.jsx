import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { successToast } from "@/utils/notifications"

export default function PatientFormModal({ open, onClose, onSave, patient, healthPlans }) {
    const isEditing = !!patient

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            birth_date: "",
            dni: "",
            address: "",
            phone_number: "",
            city: "",
            membership_number: "",
            id_health_plan: ""
        }
    })

    // Observar cambios en los campos
    const watchBirthDate = watch("birth_date")

    // Validación personalizada para email
    const validateEmail = (email) => {
        if (!email) return "El email es requerido"
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return "Ingrese un email válido"
        }
        
        return true
    }

    // Validación personalizada para DNI
    const validateDNI = (dni) => {
        if (!dni) return "El DNI es requerido"
        
        const dniRegex = /^\d+$/
        if (!dniRegex.test(dni)) {
            return "El DNI debe contener solo números"
        }
        
        if (dni.length < 7 || dni.length > 9) {
            return "El DNI debe tener entre 7 y 9 dígitos"
        }
        
        return true
    }

    // Validación personalizada para fecha de nacimiento
    const validateBirthDate = (date) => {
        if (!date) return true // No es obligatorio
        
        const birthDate = new Date(date)
        const today = new Date()
        
        if (birthDate > today) {
            return "La fecha de nacimiento no puede ser futura"
        }
        
        // Validar que no sea menor a 150 años (aproximadamente)
        const minDate = new Date()
        minDate.setFullYear(today.getFullYear() - 150)
        
        if (birthDate < minDate) {
            return "La fecha de nacimiento no es válida"
        }
        
        return true
    }

    // Validación personalizada para teléfono
    const validatePhone = (phone) => {
        if (!phone) return true // No es obligatorio
        
        const phoneRegex = /^[\d\s+\-()]+$/
        if (!phoneRegex.test(phone)) {
            return "El teléfono contiene caracteres inválidos"
        }
        
        // Remover caracteres especiales y contar dígitos
        const digitsOnly = phone.replace(/\D/g, '')
        if (digitsOnly.length < 8) {
            return "El teléfono debe tener al menos 8 dígitos"
        }
        
        return true
    }

    useEffect(() => {
        if (patient) {
            // Establecer valores cuando hay un paciente para editar
            reset({
                first_name: patient.first_name || "",
                last_name: patient.last_name || "",
                email: patient.email || "",
                birth_date: patient.birth_date || "",
                dni: patient.dni || "",
                address: patient.address || "",
                phone_number: patient.phone_number || "",
                city: patient.city || "",
                membership_number: patient.membership_number || "",
                id_health_plan: patient.id_health_plan || ""
            })
        } else {
            // Resetear formulario para nuevo paciente
            reset({
                first_name: "",
                last_name: "",
                email: "",
                birth_date: "",
                dni: "",
                address: "",
                phone_number: "",
                city: "",
                membership_number: "",
                id_health_plan: ""
            })
        }
    }, [patient, open, reset])

    const onSubmit = (data) => {
        const patientData = {
            ...data,
            id_user: patient?.id_user
        }

        onSave(patientData)

        if (isEditing) {
            successToast("Paciente actualizado exitosamente")
        } else {
            successToast("Paciente creado exitosamente")
        }

        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Paciente" : "Nuevo Paciente"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Campos Obligatorios */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">Nombre *</Label>
                            <Input
                                id="first_name"
                                {...register("first_name", { 
                                    required: "El nombre es requerido",
                                    minLength: {
                                        value: 2,
                                        message: "El nombre debe tener al menos 2 caracteres"
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "El nombre no puede exceder 50 caracteres"
                                    }
                                })}
                                className={errors.first_name ? "border-red-500" : ""}
                                placeholder="Ingrese el nombre"
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-xs">{errors.first_name.message}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Apellido *</Label>
                            <Input
                                id="last_name"
                                {...register("last_name", { 
                                    required: "El apellido es requerido",
                                    minLength: {
                                        value: 2,
                                        message: "El apellido debe tener al menos 2 caracteres"
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "El apellido no puede exceder 50 caracteres"
                                    }
                                })}
                                className={errors.last_name ? "border-red-500" : ""}
                                placeholder="Ingrese el apellido"
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-xs">{errors.last_name.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dni">DNI *</Label>
                            <Input
                                id="dni"
                                {...register("dni", { 
                                    required: "El DNI es requerido",
                                    validate: validateDNI
                                })}
                                className={errors.dni ? "border-red-500" : ""}
                                placeholder="Ingrese el DNI"
                            />
                            {errors.dni && (
                                <p className="text-red-500 text-xs">{errors.dni.message}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                {...register("birth_date", {
                                    validate: validateBirthDate
                                })}
                                className={errors.birth_date ? "border-red-500" : ""}
                            />
                            {errors.birth_date && (
                                <p className="text-red-500 text-xs">{errors.birth_date.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email", { 
                                required: "El email es requerido",
                                validate: validateEmail
                            })}
                            className={errors.email ? "border-red-500" : ""}
                            placeholder="ejemplo@correo.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Campos Opcionales */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Teléfono</Label>
                            <Input
                                id="phone_number"
                                {...register("phone_number", {
                                    validate: validatePhone
                                })}
                                className={errors.phone_number ? "border-red-500" : ""}
                                placeholder="+54 11 1234-5678"
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-xs">{errors.phone_number.message}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input
                                id="city"
                                {...register("city", {
                                    maxLength: {
                                        value: 50,
                                        message: "La ciudad no puede exceder 50 caracteres"
                                    }
                                })}
                                className={errors.city ? "border-red-500" : ""}
                                placeholder="Ingrese la ciudad"
                            />
                            {errors.city && (
                                <p className="text-red-500 text-xs">{errors.city.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                            id="address"
                            {...register("address", {
                                maxLength: {
                                    value: 100,
                                    message: "La dirección no puede exceder 100 caracteres"
                                }
                            })}
                            className={errors.address ? "border-red-500" : ""}
                            placeholder="Ingrese la dirección completa"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-xs">{errors.address.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="id_health_plan">Plan de Salud</Label>
                            <Select
                                onValueChange={(value) => setValue("id_health_plan", value)}
                                defaultValue={watch("id_health_plan")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {healthPlans.map(plan => (
                                        <SelectItem key={plan.id_health_plan} value={plan.id_health_plan.toString()}>
                                            {plan.health_insurance.name} - {plan.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input
                                type="hidden"
                                {...register("id_health_plan")}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="membership_number">Número de Afiliado</Label>
                            <Input
                                id="membership_number"
                                {...register("membership_number", {
                                    maxLength: {
                                        value: 20,
                                        message: "El número de afiliado no puede exceder 20 caracteres"
                                    }
                                })}
                                className={errors.membership_number ? "border-red-500" : ""}
                                placeholder="Número de afiliado"
                            />
                            {errors.membership_number && (
                                <p className="text-red-500 text-xs">{errors.membership_number.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        * Campos obligatorios
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {isEditing ? "Guardar Cambios" : "Crear Paciente"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}