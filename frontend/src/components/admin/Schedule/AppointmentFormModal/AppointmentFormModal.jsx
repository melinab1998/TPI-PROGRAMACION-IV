import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { successToast } from "@/utils/notifications"

const mockPatients = [
    { id: 1, name: "María López", email: "maria@email.com", dni: "41239736", phone: "1122334455" },
    { id: 2, name: "Juan Pérez", email: "juan@email.com", dni: "38987654", phone: "1166778899" },
    { id: 3, name: "Ana Gómez", email: "ana@email.com", dni: "35123456", phone: "1133445566" },
    { id: 4, name: "Carlos Rodríguez", email: "carlos@email.com", dni: "28765432", phone: "1155667788" },
    { id: 5, name: "Laura Martínez", email: "laura@email.com", dni: "40123456", phone: "1144556677" },
    { id: 6, name: "Diego Sánchez", email: "diego@email.com", dni: "36543210", phone: "1177889900" }
]

const mockDentists = [
    { id: 1, name: "Dr. Alejandro Suárez", specialty: "Ortodoncia" },
    { id: 2, name: "Dra. Carolina Mendoza", specialty: "Endodoncia" },
    { id: 3, name: "Dr. Roberto Díaz", specialty: "Cirugía" },
    { id: 4, name: "Dra. Laura Fernández", specialty: "Periodoncia" }
]

export default function AppointmentFormModal({
    open,
    onClose,
    onSave,
    appointment = null
}) {
    const editMode = !!appointment

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
        setValue,
        watch,
        reset,
        trigger,
        setError,
        clearErrors
    } = useForm({
        defaultValues: {
            appointment_date: "",
            appointment_time: "",
            patient_id: "",
            dentist_id: "",
            consultation_type: "Consulta"
        }
    })

    const [patientSearch, setPatientSearch] = useState("")
    const [filteredPatients, setFilteredPatients] = useState(mockPatients)
    const [patientFieldTouched, setPatientFieldTouched] = useState(false)
    const navigate = useNavigate();

    const watchPatientId = watch("patient_id")

    const handleNewPatient = () => {
        onClose();
        navigate("/patients", { state: { openNewPatientModal: true } });
    };

    useEffect(() => {
        if (patientSearch.trim() === "") {
            setFilteredPatients(mockPatients.slice(0, 5))
        } else {
            const filtered = mockPatients.filter(patient =>
                patient.dni.includes(patientSearch) ||
                patient.name.toLowerCase().includes(patientSearch.toLowerCase())
            )
            setFilteredPatients(filtered)
        }
    }, [patientSearch])

    useEffect(() => {
        if (appointment) {
            const dateTime = appointment.appointment_date.split('T')
            reset({
                appointment_date: dateTime[0] || "",
                appointment_time: dateTime[1]?.substring(0, 5) || "",
                patient_id: appointment.patient_id || "",
                dentist_id: appointment.dentist_id || "",
                consultation_type: appointment.consultation_type || "Consulta"
            })

            if (appointment.patient_id) {
                const patient = mockPatients.find(p => p.id === parseInt(appointment.patient_id))
                if (patient) {
                    setPatientSearch(patient.dni)
                }
            }
        } else {
            reset({
                appointment_date: "",
                appointment_time: "",
                patient_id: "",
                dentist_id: "",
                consultation_type: "Consulta"
            })
            setPatientSearch("")
            setPatientFieldTouched(false)
        }
    }, [appointment, open, reset])

    const handlePatientSelect = (patientId) => {
        setValue("patient_id", patientId, { shouldValidate: true })
        const patient = mockPatients.find(p => p.id === parseInt(patientId))
        if (patient) {
            setPatientSearch(patient.dni)
        }
        setPatientFieldTouched(true)
        clearErrors("patient_id")
    }

    const handlePatientSearchBlur = () => {
        setPatientFieldTouched(true)
        trigger("patient_id")
    }

    const onSubmit = (data) => {
        trigger().then(isValid => {
            if (!isValid) {
                if (!data.patient_id) {
                    setError("patient_id", {
                        type: "manual",
                        message: "Seleccione un paciente"
                    })
                }
                return
            }

            const appointmentDateTime = `${data.appointment_date}T${data.appointment_time}:00`

            const selectedPatient = mockPatients.find(p => p.id === parseInt(data.patient_id))
            const selectedDentist = mockDentists.find(d => d.id === parseInt(data.dentist_id))

            const appointmentData = {
                ...data,
                patient_name: selectedPatient?.name || "",
                patient_email: selectedPatient?.email || "",
                patient_dni: selectedPatient?.dni || "",
                patient_phone: selectedPatient?.phone || "",
                appointment_date: appointmentDateTime,
                dentist_name: selectedDentist?.name || "",
                dentist_id: data.dentist_id
            }

            if (appointment) {
                appointmentData.id_turn = appointment.id_turn
                appointmentData.status = appointment.status
            }

            onSave(appointmentData)

            successToast(editMode ? "Turno actualizado exitosamente" : "Turno creado exitosamente")
            onClose()
        })
    }

    const generateTimeSlots = () => {
        const slots = []
        for (let hour = 8; hour <= 19; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                slots.push(timeString)
            }
        }
        return slots
    }

    const timeSlots = generateTimeSlots()
    const showPatientError = errors.patient_id && (patientFieldTouched || isSubmitted)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {editMode ? "Editar Turno" : "Nuevo Turno"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="appointment_date">Fecha</Label>
                            <Input
                                id="appointment_date"
                                type="date"
                                {...register("appointment_date", {
                                    required: "La fecha es requerida",
                                    validate: (date) => {
                                        if (!date) return "La fecha es requerida"
                                        const selected = new Date(date)
                                        const today = new Date()
                                        today.setHours(0, 0, 0, 0)
                                        return selected >= today || "No se pueden agendar turnos pasados"
                                    }
                                })}
                                className={errors.appointment_date ? "border-red-500" : ""}
                            />
                            {errors.appointment_date && (
                                <p className="text-red-500 text-xs">{errors.appointment_date.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appointment_time">Hora</Label>
                            <Select
                                onValueChange={(value) => setValue("appointment_time", value, { shouldValidate: true })}
                                defaultValue={watch("appointment_time")}
                            >
                                <SelectTrigger className={errors.appointment_time ? "border-red-500" : ""}>
                                    <SelectValue placeholder="HH:MM" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {timeSlots.map(time => (
                                        <SelectItem key={time} value={time}>
                                            {time}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input
                                type="hidden"
                                {...register("appointment_time", { required: "La hora es requerida" })}
                            />
                            {errors.appointment_time && (
                                <p className="text-red-500 text-xs">{errors.appointment_time.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dentist_id">Dentista</Label>
                        <Select
                            onValueChange={(value) => setValue("dentist_id", value, { shouldValidate: true })}
                            defaultValue={watch("dentist_id")}
                        >
                            <SelectTrigger className={errors.dentist_id ? "border-red-500" : ""}>
                                <SelectValue placeholder="Seleccione dentista" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockDentists.map(dentist => (
                                    <SelectItem key={dentist.id} value={dentist.id.toString()}>
                                        {dentist.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input
                            type="hidden"
                            {...register("dentist_id", { required: "Seleccione un dentista" })}
                        />
                        {errors.dentist_id && (
                            <p className="text-red-500 text-xs">{errors.dentist_id.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="patient_search">Paciente *</Label>

                        {!watchPatientId ? (
                            <>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="patient_search"
                                        placeholder="Buscar por DNI o nombre..."
                                        value={patientSearch}
                                        onChange={(e) => setPatientSearch(e.target.value)}
                                        className={`pl-9 ${showPatientError ? "border-red-500" : ""}`}
                                        onBlur={handlePatientSearchBlur}
                                    />
                                </div>
                                {showPatientError && (
                                    <p className="text-red-500 text-xs">{errors.patient_id.message}</p>
                                )}
                                {patientSearch && (
                                    <div className="border rounded-md max-h-32 overflow-y-auto">
                                        {filteredPatients.length > 0 ? (
                                            filteredPatients.map(patient => (
                                                <div
                                                    key={patient.id}
                                                    className="p-2 cursor-pointer hover:bg-muted"
                                                    onClick={() => handlePatientSelect(patient.id.toString())}
                                                >
                                                    <div className="font-medium">{patient.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        DNI: {patient.dni}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-muted-foreground text-center">
                                                No se encontraron pacientes
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="space-y-2">
                                <div className="p-2 border rounded-md bg-muted/20">
                                    <div className="text-sm font-medium">
                                        {mockPatients.find(p => p.id === parseInt(watchPatientId))?.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        DNI: {mockPatients.find(p => p.id === parseInt(watchPatientId))?.dni}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setValue("patient_id", "", { shouldValidate: true })
                                        setPatientSearch("")
                                        setPatientFieldTouched(true)
                                    }}
                                >
                                    Cambiar paciente
                                </Button>
                            </div>
                        )}

                        <input
                            type="hidden"
                            {...register("patient_id", {
                                required: "Seleccione un paciente",
                                validate: (value) => value ? true : "Seleccione un paciente"
                            })}
                        />
                        {!watchPatientId && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                onClick={handleNewPatient}
                            >
                                + Nuevo Paciente
                            </Button>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="consultation_type">Tipo de Turno</Label>
                        <Select
                            onValueChange={(value) => setValue("consultation_type", value, { shouldValidate: true })}
                            defaultValue={watch("consultation_type")}
                        >
                            <SelectTrigger className={errors.consultation_type ? "border-red-500" : ""}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Consulta">Consulta</SelectItem>
                                <SelectItem value="Tratamiento">Tratamiento</SelectItem>
                            </SelectContent>
                        </Select>
                        <input
                            type="hidden"
                            {...register("consultation_type", { required: "Seleccione el tipo de turno" })}
                        />
                        {errors.consultation_type && (
                            <p className="text-red-500 text-xs">{errors.consultation_type.message}</p>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editMode ? "Guardar Cambios" : "Crear Turno"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
