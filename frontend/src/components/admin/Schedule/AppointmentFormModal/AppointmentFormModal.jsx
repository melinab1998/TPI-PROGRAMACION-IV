import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { successToast } from "@/utils/notifications"
import { appointmentValidations } from "@/utils/validations"

const mockPatients = [
  { id: 1, name: "María López", dni: "41239736" },
  { id: 2, name: "Juan Pérez", dni: "38987654" },
  { id: 3, name: "Ana Gómez", dni: "35123456" },
  { id: 4, name: "Carlos Rodríguez", dni: "28765432" }
]

export default function AppointmentFormModal({ open, onClose, onSave, appointment = null, dentist }) {
  const editMode = !!appointment
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      appointment_date: "",
      appointment_time: "",
      patient_id: "",
      consultation_type: "Consulta"
    }
  })

  const [patientSearch, setPatientSearch] = useState("")
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)
  const watchPatientId = watch("patient_id")

  useEffect(() => {
    reset({
      appointment_date: appointment?.appointment_date?.split("T")[0] || "",
      appointment_time: appointment?.appointment_date?.split("T")[1]?.substring(0,5) || "",
      patient_id: appointment?.patient_id || "",
      consultation_type: appointment?.consultation_type || "Consulta"
    })
    if (appointment?.patient_id) {
      const p = mockPatients.find(p => p.id === appointment.patient_id)
      if (p) setPatientSearch(p.dni)
    } else {
      setPatientSearch("")
    }
  }, [appointment, reset])

  useEffect(() => {
    if (!patientSearch) return setFilteredPatients(mockPatients)
    const filtered = mockPatients.filter(p =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.dni.includes(patientSearch)
    )
    setFilteredPatients(filtered)
  }, [patientSearch])

  const handlePatientSelect = (id) => {
    setValue("patient_id", id)
    const p = mockPatients.find(p => p.id === id)
    if (p) setPatientSearch(p.dni)
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let h = 8; h <= 19; h++) {
      for (let m = 0; m < 60; m += 30) {
        slots.push(`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const onSubmit = (data) => {
    const patient = mockPatients.find(p => p.id === parseInt(data.patient_id))
    if (!patient) return alert("Seleccione un paciente")
    const appointmentData = {
      appointment_date: `${data.appointment_date}T${data.appointment_time}:00`,
      patient_id: patient.id,
      patient_name: patient.name,
      dentist_id: dentist.id,
      dentist_name: dentist.name,
      consultation_type: data.consultation_type,
      id_turn: appointment?.id_turn
    }
    onSave(appointmentData)
    successToast(editMode ? "Turno actualizado" : "Turno creado")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editMode ? "Editar Turno" : "Nuevo Turno"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" {...register("appointment_date", appointmentValidations.appointment_date)} />
              {errors.appointment_date && <p className="text-red-500 text-xs">{errors.appointment_date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Hora</Label>
              <Select onValueChange={val => setValue("appointment_time", val)} defaultValue={watch("appointment_time")}>
                <SelectTrigger>
                  <SelectValue placeholder="HH:MM" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("appointment_time", appointmentValidations.appointment_time)} />
              {errors.appointment_time && <p className="text-red-500 text-xs">{errors.appointment_time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Paciente *</Label>
            {!watchPatientId ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por DNI o nombre"
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {patientSearch && (
                  <div className="border rounded-md max-h-32 overflow-y-auto">
                    {filteredPatients.map(p => (
                      <div key={p.id} className="p-2 cursor-pointer hover:bg-muted" onClick={() => handlePatientSelect(p.id)}>
                        {p.name} - DNI: {p.dni}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-2 border rounded-md bg-muted/20">
                {mockPatients.find(p => p.id === parseInt(watchPatientId))?.name} - DNI: {mockPatients.find(p => p.id === parseInt(watchPatientId))?.dni}
                <Button type="button" size="sm" variant="outline" onClick={() => {setValue("patient_id", ""); setPatientSearch("")}}>Cambiar</Button>
              </div>
            )}
            <input type="hidden" {...register("patient_id", appointmentValidations.patient_id)} />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Turno</Label>
            <Select onValueChange={val => setValue("consultation_type", val)} defaultValue={watch("consultation_type")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Consulta">Consulta</SelectItem>
                <SelectItem value="Tratamiento">Tratamiento</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("consultation_type")} />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{editMode ? "Guardar" : "Crear Turno"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
