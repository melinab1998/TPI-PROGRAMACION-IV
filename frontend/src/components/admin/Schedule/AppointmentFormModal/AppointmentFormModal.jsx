import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { successToast } from "@/utils/notifications";
import { appointmentValidations } from "@/utils/validations";
import { getAllPatients, getAvailableSlots } from "@/services/api.services";
import { AuthContext } from "@/services/auth/AuthContextProvider";

export default function AppointmentFormModal({ open, onClose, onSave, appointment = null }) {
  const { token, userId } = useContext(AuthContext);
  const editMode = !!appointment;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      appointment_date: "",
      appointment_time: "",
      patient_id: "",
      consultation_type: "Consulta"
    }
  });

  const [patientSearch, setPatientSearch] = useState("");
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({}); 

  const watchPatientId = watch("patient_id");
  const watchDate = watch("appointment_date");

  // -------------------- Helper para parsear fecha local --------------------
  const parseDateAsLocal = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // Meses van de 0 a 11
  }

  // -------------------- Cargar pacientes --------------------
  useEffect(() => {
    if (!token) return;
    getAllPatients(token,
      (patients) => {
        setAllPatients(patients);
        setFilteredPatients(patients);
      },
      (err) => console.error("Error cargando pacientes:", err)
    );
  }, [token]);

  // -------------------- Cargar slots disponibles --------------------
  useEffect(() => {
    if (!open || !userId || !token) return;

    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    console.log("=== Solicitud de slots ===");
    console.log("Dentista:", userId);
    console.log("Fecha inicio:", startDate);
    console.log("Fecha fin:", endDate.toISOString().split("T")[0]);

    getAvailableSlots(
      token,
      userId,
      startDate,
      endDate.toISOString().split("T")[0],
      (slots) => {
        console.log("=== Respuesta backend ===");
        console.log(slots); // viene como { "2025-11-04": [...], ... }

        setAvailableSlots(slots || {}); 
      },
      (err) => console.error("Error cargando slots:", err)
    );
  }, [open, userId, token]);

  // -------------------- Reset formulario al editar --------------------
  useEffect(() => {
    reset({
      appointment_date: appointment?.appointment_date?.split("T")[0] || "",
      appointment_time: appointment?.appointment_date?.split("T")[1]?.substring(0, 5) || "",
      patient_id: appointment?.patient_id || "",
      consultation_type: appointment?.consultation_type || "Consulta"
    });

    if (appointment?.patient_id) {
      const p = allPatients.find(p => p.id === appointment.patient_id);
      if (p) setPatientSearch(p.dni);
    } else {
      setPatientSearch("");
    }
  }, [appointment, allPatients, reset]);

  // -------------------- Filtrado de pacientes --------------------
  useEffect(() => {
    if (!patientSearch) return setFilteredPatients(allPatients);
    const filtered = allPatients.filter(p =>
      p.firstName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.lastName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.dni.includes(patientSearch)
    );
    setFilteredPatients(filtered);
  }, [patientSearch, allPatients]);

  const handlePatientSelect = (id) => {
    setValue("patient_id", id);
    const p = allPatients.find(p => p.id === id);
    if (p) setPatientSearch(p.dni);
  }

  // -------------------- Submit --------------------
  const onSubmit = (data) => {
    const patient = allPatients.find(p => p.id === parseInt(data.patient_id));
    if (!patient) return alert("Seleccione un paciente");

    const appointmentData = {
      appointment_date: `${data.appointment_date}T${data.appointment_time}:00`,
      patient_id: patient.id,
      patient_name: `${patient.firstName} ${patient.lastName}`,
      dentist_id: userId,
      consultation_type: data.consultation_type,
      id_turn: appointment?.id_turn
    };

    onSave(appointmentData);
    successToast(editMode ? "Turno actualizado" : "Turno creado");
    onClose();
  }

  const slotsForSelectedDate = watchDate ? availableSlots[watchDate] || [] : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editMode ? "Editar Turno" : "Nuevo Turno"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Fecha */}
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Select
              onValueChange={val => setValue("appointment_date", val)}
              defaultValue={watch("appointment_date")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una fecha" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Object.keys(availableSlots).length > 0 ? (
                  Object.keys(availableSlots)
                    .sort((a, b) => parseDateAsLocal(a) - parseDateAsLocal(b))
                    .map(date => (
                      <SelectItem key={date} value={date}>
                        {parseDateAsLocal(date).toLocaleDateString("es-AR", {
                          weekday: "long",
                          day: "numeric",
                          month: "short"
                        })}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem disabled>No hay fechas disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("appointment_date", appointmentValidations.appointment_date)} />
            {errors.appointment_date && <p className="text-red-500 text-xs">{errors.appointment_date.message}</p>}
          </div>

          {/* Hora */}
          <div className="space-y-2">
            <Label>Hora</Label>
            <Select
              onValueChange={val => setValue("appointment_time", val)}
              defaultValue={watch("appointment_time")}
              disabled={!watchDate || slotsForSelectedDate.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="HH:MM" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {slotsForSelectedDate.length > 0 ? (
                  slotsForSelectedDate.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No hay horarios disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("appointment_time", appointmentValidations.appointment_time)} />
            {errors.appointment_time && <p className="text-red-500 text-xs">{errors.appointment_time.message}</p>}
          </div>

          {/* Paciente */}
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

          {/* Tipo de Turno */}
          <div className="space-y-2">
            <Label>Tipo de Turno</Label>
            <Select
              onValueChange={val => setValue("consultation_type", val)}
              defaultValue={watch("consultation_type")}
            >
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
  );
}
