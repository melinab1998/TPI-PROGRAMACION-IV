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
import { getAllPatients } from "@/services/api.services"

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

  const token = localStorage.getItem('token')

  const [patientSearch, setPatientSearch] = useState("")
  const [allPatients, setAllPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const watchPatientId = watch("patient_id")

  // Cargar pacientes reales desde backend
  useEffect(() => {
    if (!token) return
    getAllPatients(token,
      (patients) => {
        setAllPatients(patients)
        setFilteredPatients(patients)
      },
      (err) => console.error('Error cargando pacientes:', err)
    )
  }, [token])

  useEffect(() => {
    reset({
      appointment_date: appointment?.appointment_date?.split("T")[0] || "",
      appointment_time: appointment?.appointment_date?.split("T")[1]?.substring(0, 5) || "",
      patient_id: appointment?.patient_id || "",
      consultation_type: appointment?.consultation_type || "Consulta"
    })
    if (appointment?.patient_id) {
      const p = allPatients.find(p => p.id === appointment.patient_id)
      if (p) setPatientSearch(p.dni)
    } else {
      setPatientSearch("")
    }
  }, [appointment, allPatients, reset])

  // Filtrado en tiempo real
  useEffect(() => {
    if (!patientSearch) return setFilteredPatients(allPatients)
    const filtered = allPatients.filter(p =>
      p.firstName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.lastName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.dni.includes(patientSearch)
    )
    setFilteredPatients(filtered)
  }, [patientSearch, allPatients])

  const handlePatientSelect = (id) => {
    setValue("patient_id", id)
    const p = allPatients.find(p => p.id === id)
    if (p) setPatientSearch(p.dni)
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let h = 8; h <= 19; h++) {
      for (let m = 0; m < 60; m += 30) {
        slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const onSubmit = (data) => {
    const patient = allPatients.find(p => p.id === parseInt(data.patient_id))
    if (!patient) return alert("Seleccione un paciente")
    const appointmentData = {
      appointment_date: `${data.appointment_date}T${data.appointment_time}:00`,
      patient_id: patient.id,
      patient_name: `${patient.firstName} ${patient.lastName}`,
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
        <div className="border rounded-md max-h-40 overflow-y-auto mt-1 bg-white shadow-sm">
          {filteredPatients.length > 0 ? (
            filteredPatients.map(p => (
              <div
                key={p.id}
                className="p-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                onClick={() => handlePatientSelect(p.id)}
              >
                {p.firstName} {p.lastName} - DNI: {p.dni}
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No se encontraron pacientes con ese nombre o DNI</div>
          )}
        </div>
      )}
    </>
  ) : (
    <div className="p-2 border rounded-md bg-muted/20 flex items-center justify-between text-sm text-gray-700">
      <span>
        {allPatients.find(p => p.id === parseInt(watchPatientId))?.firstName}{" "}
        {allPatients.find(p => p.id === parseInt(watchPatientId))?.lastName} - DNI:{" "}
        {allPatients.find(p => p.id === parseInt(watchPatientId))?.dni}
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => { setValue("patient_id", ""); setPatientSearch(""); }}
      >
        x
      </Button>
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
