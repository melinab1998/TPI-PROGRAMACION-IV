import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { errorToast, successToast } from "@/utils/notifications";
import { appointmentValidations } from "@/utils/validations";
import { getAllPatients, getAvailableSlots, createTurn, updateTurn } from "@/services/api.services";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const watchPatientId = watch("patient_id");
  const watchDate = watch("appointment_date");

  const parseDateAsLocal = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  useEffect(() => {
    if (!token) return;

    getAllPatients(
      token,
      (patients) => {
        setAllPatients(patients);
        setFilteredPatients(patients);
      },
      (err) => {
        errorToast(err?.message || "Error del servidor");
      }
    );
  }, [token]);

  useEffect(() => {
    if (!open || !userId || !token) return;

    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    getAvailableSlots(
      token,
      userId,
      startDate,
      endDate.toISOString().split("T")[0],
      (slots) => {
        setAvailableSlots(slots || {});
      },
      (err) => {
        errorToast(err?.message || "Error al cargar los horarios disponibles");
      }
    );
  }, [open, userId, token]);

  useEffect(() => {
    if (!open) return;

    reset({
      appointment_date: "",
      appointment_time: "",
      patient_id: "",
      consultation_type: "Consulta"
    });

    if (!editMode) {
      setPatientSearch("");
      return;
    }

    if (allPatients.length === 0 || Object.keys(availableSlots).length === 0) return;

    let patient;
    if (appointment.patientId) {
      patient = allPatients.find(p => p.id === appointment.patientId);
    }
    if (!patient) {
      patient = allPatients.find(p => `${p.firstName} ${p.lastName}` === appointment.patient_name);
    }

    if (patient) {
      setPatientSearch(`${patient.firstName} ${patient.lastName} - ${patient.dni}`);
      setValue("patient_id", patient.id, { shouldValidate: true });
    }

    if (appointment.appointment_date) {
      const dateObj = new Date(appointment.appointment_date);

      const date = dateObj.toISOString().split("T")[0];
      setValue("appointment_date", date, { shouldValidate: true });

      const hours = dateObj.getHours().toString().padStart(2, "0");
      const minutes = dateObj.getMinutes().toString().padStart(2, "0");
      const appointmentTime = `${hours}:${minutes}`;

      const currentSlots = availableSlots[date] || [];
      if (!currentSlots.includes(appointmentTime)) {
        setAvailableSlots(prev => ({
          ...prev,
          [date]: [appointmentTime, ...currentSlots]
        }));
      }

      setValue("appointment_time", appointmentTime, { shouldValidate: true });
    }

    setValue("consultation_type", appointment.consultation_type || "Consulta", { shouldValidate: true });

  }, [open, editMode, appointment, allPatients, availableSlots, setValue, reset]);

  useEffect(() => {
    if (!patientSearch) {
      setFilteredPatients(allPatients);
    } else {
      const filtered = allPatients.filter(p =>
        p.firstName.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.lastName.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.dni.includes(patientSearch)
      );
      setFilteredPatients(filtered);
    }
  }, [patientSearch, allPatients]);

  const handlePatientSelect = (id) => {
    setValue("patient_id", id, { shouldValidate: true });
    const patient = allPatients.find(p => p.id === id);
    if (patient) setPatientSearch(`${patient.firstName} ${patient.lastName} - ${patient.dni}`);
  }

  const handleClearPatient = () => {
    setValue("patient_id", "", { shouldValidate: true });
    setPatientSearch("");
  }

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const patient = allPatients.find(p => p.id === parseInt(data.patient_id));
    if (!patient) {
      errorToast("Seleccione un paciente");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      appointmentDate: `${data.appointment_date}T${data.appointment_time}:00`,
      consultationType: data.consultation_type,
      patientId: patient.id,
      dentistId: userId
    };

    try {
      if (editMode) {
        await updateTurn(token, appointment.id_turn, payload,
          (turnFromBackend) => {
            onSave(turnFromBackend);
            onClose();
          },
          (err) => errorToast(err.message || "Error al actualizar turno")
        );
      } else {
        await createTurn(token, payload,
          (turnFromBackend) => {
            onSave(turnFromBackend);
            onClose();
          },
          (err) => errorToast(err.message || "Error al crear turno")
        );
      }
    } catch (error) {
      errorToast("Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slotsForSelectedDate = watchDate ? availableSlots[watchDate] || [] : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editMode ? "Editar Turno" : "Nuevo Turno"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Select
              onValueChange={val => setValue("appointment_date", val, { shouldValidate: true })}
              value={watch("appointment_date")}
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
                        {parseDateAsLocal(date).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short" })}
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
          <div className="space-y-2">
            <Label>Hora</Label>
            <Select
              onValueChange={val => setValue("appointment_time", val, { shouldValidate: true })}
              value={watch("appointment_time")}
              disabled={!watchDate || slotsForSelectedDate.length === 0}
            >
              <SelectTrigger><SelectValue placeholder="HH:MM" /></SelectTrigger>
              <SelectContent className="max-h-60">
                {slotsForSelectedDate.length > 0 ? (
                  slotsForSelectedDate.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)
                ) : (
                  <SelectItem disabled>No hay horarios disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("appointment_time", appointmentValidations.appointment_time)} />
            {errors.appointment_time && <p className="text-red-500 text-xs">{errors.appointment_time.message}</p>}
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
                        <div key={p.id} className="p-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                          onClick={() => handlePatientSelect(p.id)}>
                          {p.firstName} {p.lastName} - DNI: {p.dni}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">No se encontraron pacientes</div>
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
                <Button type="button" size="sm" variant="outline" onClick={handleClearPatient}>x</Button>
              </div>
            )}
            <input type="hidden" {...register("patient_id", appointmentValidations.patient_id)} />
            {errors.patient_id && <p className="text-red-500 text-xs">{errors.patient_id.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Tipo de Turno</Label>
            <Select
              onValueChange={val => setValue("consultation_type", val, { shouldValidate: true })}
              value={watch("consultation_type")}
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : (editMode ? "Guardar" : "Crear Turno")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
