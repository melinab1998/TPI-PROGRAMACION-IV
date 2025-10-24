import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import { getHealthPlansByInsurance } from "@/services/api.services";
import { successToast, errorToast } from "@/utils/notifications";
import { patientValidations } from "@/utils/validations";

export default function PatientFormModal({
  open,
  onClose,
  onSave,
  patient,
  healthInsurances = [],
}) {
  const isEditing = !!patient;
  const { token } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
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
      healthInsuranceId: "",
      healthPlanId: "",
    },
  });

  const selectedInsurance = watch("healthInsuranceId");
  const selectedPlan = watch("healthPlanId");

  // Cargar datos del paciente al abrir el modal
  useEffect(() => {
    if (patient) {
      reset({
        first_name: patient.first_name || patient.firstName || "",
        last_name: patient.last_name || patient.lastName || "",
        email: patient.email || patient.Email || "",
        birth_date: patient.birth_date || patient.birthDate || "",
        dni: patient.dni || "",
        address: patient.address || "",
        phone_number: patient.phone_number || patient.phoneNumber || "",
        city: patient.city || "",
        membership_number: patient.membership_number || patient.membershipNumber || "",
        healthInsuranceId: patient.healthInsuranceId || "",
        healthPlanId: patient.healthPlanId || "",
      });
    } else {
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
        healthInsuranceId: "",
        healthPlanId: "",
      });
      setPlans([]);
    }
  }, [patient, open, reset]);

  // Cargar planes según obra social seleccionada
  useEffect(() => {
    if (!selectedInsurance || !token) {
      setPlans([]);
      setValue("healthPlanId", "");
      return;
    }

    getHealthPlansByInsurance(
      token,
      selectedInsurance,
      (data) => setPlans(data || []),
      () => {
        setPlans([]);
        errorToast("Error al cargar planes de la obra social seleccionada");
      }
    );

    // Limpiar plan si no pertenece a la obra social seleccionada
    if (!plans.find((p) => p.id.toString() === selectedPlan)) {
      setValue("healthPlanId", "");
    }
  }, [selectedInsurance, token, setValue]);

  const onSubmit = (data) => {
    const patientData = {
      ...data,
      id_user: patient?.id_user,
      healthInsuranceId: data.healthInsuranceId || null,
      healthPlanId: data.healthPlanId || null,
    };

    onSave(patientData);
    onClose();
  };

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
                {...register("first_name", patientValidations.first_name)}
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido *</Label>
              <Input
                id="last_name"
                placeholder="Ingrese el apellido"
                {...register("last_name", patientValidations.last_name)}
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
            </div>
          </div>

          {/* DNI y Fecha de nacimiento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                placeholder="Ingrese el DNI"
                {...register("dni", patientValidations.dni)}
                className={errors.dni ? "border-red-500" : ""}
              />
              {errors.dni && <p className="text-red-500 text-xs">{errors.dni.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date">Fecha de nacimiento</Label>
              <Input
                id="birth_date"
                type="date"
                {...register("birth_date", patientValidations.birth_date)}
                className={errors.birth_date ? "border-red-500" : ""}
              />
              {errors.birth_date && <p className="text-red-500 text-xs">{errors.birth_date.message}</p>}
            </div>
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                {...register("email", patientValidations.email)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Teléfono</Label>
              <Input
                id="phone_number"
                placeholder="+54 11 1234-5678"
                {...register("phone_number", patientValidations.phone_number)}
                className={errors.phone_number ? "border-red-500" : ""}
              />
              {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number.message}</p>}
            </div>
          </div>

          {/* Ciudad y Dirección */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                placeholder="Ingrese la ciudad"
                {...register("city", patientValidations.city)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                placeholder="Ingrese la dirección completa"
                {...register("address", patientValidations.address)}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>
          </div>

          {/* Obra social y Plan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthInsuranceId">Obra Social</Label>
              <Select
                value={selectedInsurance || ""}
                onValueChange={(val) => setValue("healthInsuranceId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una obra social" />
                </SelectTrigger>
                <SelectContent>
                  {healthInsurances.map((os) => (
                    <SelectItem key={os.id} value={os.id.toString()}>
                      {os.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("healthInsuranceId")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="healthPlanId">Plan de salud</Label>
              <Select
                value={selectedPlan || ""}
                onValueChange={(val) => setValue("healthPlanId", val)}
                disabled={!plans.length}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedInsurance
                        ? plans.length
                          ? "Seleccione un plan"
                          : "Sin planes disponibles"
                        : "Seleccione una obra social"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("healthPlanId")} />
            </div>
          </div>

          {/* Número de afiliado */}
          <div className="space-y-2">
            <Label htmlFor="membership_number">Número de afiliado</Label>
            <Input
              id="membership_number"
              placeholder="Número de afiliado"
              {...register("membership_number", patientValidations.membership_number)}
              className={errors.membership_number ? "border-red-500" : ""}
            />
            {errors.membership_number && <p className="text-red-500 text-xs">{errors.membership_number.message}</p>}
          </div>

          <div className="text-xs text-muted-foreground">
            * Campos obligatorios
          </div>

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
  );
}
