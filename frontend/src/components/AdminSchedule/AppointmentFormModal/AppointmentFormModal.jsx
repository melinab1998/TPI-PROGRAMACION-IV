import { useState, useEffect } from "react"
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

    const [formData, setFormData] = useState({
        appointment_date: "",
        appointment_time: "",
        patient_id: "",
        dentist_id: "",
        consultation_type: "Consulta"
    })

    const [patientSearch, setPatientSearch] = useState("")
    const [filteredPatients, setFilteredPatients] = useState(mockPatients)

    const navigate = useNavigate();

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
            setFormData({
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
            setFormData({
                appointment_date: "",
                appointment_time: "",
                patient_id: "",
                dentist_id: "",
                consultation_type: "Consulta"
            })
            setPatientSearch("")
        }
    }, [appointment, open])

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handlePatientSelect = (patientId) => {
        handleFormChange('patient_id', patientId)
        const patient = mockPatients.find(p => p.id === parseInt(patientId))
        if (patient) {
            setPatientSearch(patient.dni)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.patient_id) {
            alert("Por favor, seleccione un paciente")
            return
        }

        const appointmentDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`

        const selectedPatient = mockPatients.find(p => p.id === parseInt(formData.patient_id))
        const selectedDentist = mockDentists.find(d => d.id === parseInt(formData.dentist_id))

        const appointmentData = {
            ...formData,
            patient_name: selectedPatient?.name || "",
            patient_email: selectedPatient?.email || "",
            patient_dni: selectedPatient?.dni || "",
            patient_phone: selectedPatient?.phone || "",
            appointment_date: appointmentDateTime,
            dentist_name: selectedDentist?.name || "",
            dentist_id: formData.dentist_id
        }

        if (appointment) {
            appointmentData.id_turn = appointment.id_turn
            appointmentData.status = appointment.status
        }

        onSave(appointmentData)
        
        // Mostrar toast de éxito
        if (editMode) {
            successToast("Turno actualizado exitosamente")
        } else {
            successToast("Turno creado exitosamente")
        }
        
        onClose()
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {editMode ? "Editar Turno" : "Nuevo Turno"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="appointment_date">Fecha</Label>
                            <Input
                                id="appointment_date"
                                type="date"
                                value={formData.appointment_date}
                                onChange={(e) => handleFormChange('appointment_date', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appointment_time">Hora</Label>
                            <Select
                                value={formData.appointment_time}
                                onValueChange={(value) => handleFormChange('appointment_time', value)}
                            >
                                <SelectTrigger>
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
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dentist_id">Dentista</Label>
                        <Select
                            value={formData.dentist_id}
                            onValueChange={(value) => handleFormChange('dentist_id', value)}
                        >
                            <SelectTrigger>
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
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="patient_search">Paciente</Label>

                        {!formData.patient_id ? (
                            <>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="patient_search"
                                        placeholder="Buscar por DNI o nombre..."
                                        value={patientSearch}
                                        onChange={(e) => setPatientSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
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
                                        {mockPatients.find(p => p.id === parseInt(formData.patient_id))?.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        DNI: {mockPatients.find(p => p.id === parseInt(formData.patient_id))?.dni}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        handleFormChange('patient_id', '')
                                        setPatientSearch('')
                                    }}
                                >
                                    Cambiar paciente
                                </Button>
                            </div>
                        )}
                        {!formData.patient_id && (
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
                            value={formData.consultation_type}
                            onValueChange={(value) => handleFormChange('consultation_type', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Consulta">Consulta</SelectItem>
                                <SelectItem value="Tratamiento">Tratamiento</SelectItem>
                            </SelectContent>
                        </Select>
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