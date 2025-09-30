import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PatientFormModal({ open, onClose, onSave, patient, healthPlans }) {
    const isEditing = !!patient

    const [formData, setFormData] = useState({
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

    useEffect(() => {
        if (patient) {
            setFormData({
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
            setFormData({
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
    }, [patient, open])

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const patientData = {
            ...formData,
            id_user: patient?.id_user
        }
        onSave(patientData)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Paciente" : "Nuevo Paciente"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">Nombre *</Label>
                            <Input
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) => handleChange('first_name', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Apellido *</Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => handleChange('last_name', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dni">DNI *</Label>
                            <Input
                                id="dni"
                                value={formData.dni}
                                onChange={(e) => handleChange('dni', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => handleChange('birth_date', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Teléfono</Label>
                            <Input
                                id="phone_number"
                                value={formData.phone_number}
                                onChange={(e) => handleChange('phone_number', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="id_health_plan">Plan de Salud</Label>
                            <Select
                                value={formData.id_health_plan}
                                onValueChange={(value) => handleChange('id_health_plan', value)}
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
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="membership_number">Número de Afiliado</Label>
                            <Input
                                id="membership_number"
                                value={formData.membership_number}
                                onChange={(e) => handleChange('membership_number', e.target.value)}
                            />
                        </div>
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