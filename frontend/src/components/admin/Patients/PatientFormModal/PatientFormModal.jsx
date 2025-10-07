import { useEffect } from "react"
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

    const watchBirthDate = watch("birth_date")

    useEffect(() => {
        if (patient) {
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
            reset()
        }
    }, [patient, open, reset])

    const onSubmit = (data) => {
        const patientData = { ...data, id_user: patient?.id_user }

        onSave(patientData)
        successToast(isEditing ? "Paciente actualizado exitosamente" : "Paciente creado exitosamente")
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
                    {/* Nombre y Apellido */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">Nombre *</Label>
                            <Input
                                id="first_name"
                                placeholder="Ingrese el nombre"
                                {...register("first_name", {
                                    required: "El nombre es requerido",
                                    minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
                                    maxLength: { value: 50, message: "No puede exceder 50 caracteres" }
                                })}
                                className={errors.first_name ? "border-red-500" : ""}
                            />
                            {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="last_name">Apellido *</Label>
                            <Input
                                id="last_name"
                                placeholder="Ingrese el apellido"
                                {...register("last_name", {
                                    required: "El apellido es requerido",
                                    minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
                                    maxLength: { value: 50, message: "No puede exceder 50 caracteres" }
                                })}
                                className={errors.last_name ? "border-red-500" : ""}
                            />
                            {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dni">DNI *</Label>
                            <Input
                                id="dni"
                                placeholder="Ingrese el DNI"
                                {...register("dni", {
                                    required: "El DNI es requerido",
                                    validate: (value) => {
                                        if (!/^\d+$/.test(value)) return "El DNI debe contener solo números"
                                        if (value.length < 7 || value.length > 9)
                                            return "El DNI debe tener entre 7 y 9 dígitos"
                                        return true
                                    }
                                })}
                                className={errors.dni ? "border-red-500" : ""}
                            />
                            {errors.dni && <p className="text-red-500 text-xs">{errors.dni.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                {...register("birth_date", {
                                    validate: (date) => {
                                        if (!date) return true
                                        const birth = new Date(date)
                                        const today = new Date()
                                        if (birth > today) return "La fecha no puede ser futura"
                                        const min = new Date()
                                        min.setFullYear(today.getFullYear() - 150)
                                        if (birth < min) return "La fecha no es válida"
                                        return true
                                    }
                                })}
                                className={errors.birth_date ? "border-red-500" : ""}
                            />
                            {errors.birth_date && <p className="text-red-500 text-xs">{errors.birth_date.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            {...register("email", {
                                required: "El email es requerido",
                                validate: (email) => {
                                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                    return regex.test(email) || "Ingrese un email válido"
                                }
                            })}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Teléfono</Label>
                            <Input
                                id="phone_number"
                                placeholder="+54 11 1234-5678"
                                {...register("phone_number", {
                                    validate: (phone) => {
                                        if (!phone) return true
                                        const regex = /^[\d\s+\-()]+$/
                                        if (!regex.test(phone)) return "El teléfono contiene caracteres inválidos"
                                        const digits = phone.replace(/\D/g, "")
                                        return digits.length >= 8 || "Debe tener al menos 8 dígitos"
                                    }
                                })}
                                className={errors.phone_number ? "border-red-500" : ""}
                            />
                            {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input
                                id="city"
                                placeholder="Ingrese la ciudad"
                                {...register("city", {
                                    maxLength: { value: 50, message: "No puede exceder 50 caracteres" }
                                })}
                                className={errors.city ? "border-red-500" : ""}
                            />
                            {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                            id="address"
                            placeholder="Ingrese la dirección completa"
                            {...register("address", {
                                maxLength: { value: 100, message: "No puede exceder 100 caracteres" }
                            })}
                            className={errors.address ? "border-red-500" : ""}
                        />
                        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
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
                                        <SelectItem
                                            key={plan.id_health_plan}
                                            value={plan.id_health_plan.toString()}
                                        >
                                            {plan.health_insurance.name} - {plan.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input type="hidden" {...register("id_health_plan")} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="membership_number">Número de Afiliado</Label>
                            <Input
                                id="membership_number"
                                placeholder="Número de afiliado"
                                {...register("membership_number", {
                                    maxLength: { value: 20, message: "No puede exceder 20 caracteres" }
                                })}
                                className={errors.membership_number ? "border-red-500" : ""}
                            />
                            {errors.membership_number && (
                                <p className="text-red-500 text-xs">{errors.membership_number.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground">* Campos obligatorios</div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">
                            {isEditing ? "Guardar Cambios" : "Crear Paciente"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
