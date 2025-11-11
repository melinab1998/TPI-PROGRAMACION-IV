import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
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
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      dni: "",
      address: "",
      phoneNumber: "",
      city: "",
      membershipNumber: "",
      healthInsuranceId: "",
      healthPlanId: "",
    },
  });

  const selectedInsurance = watch("healthInsuranceId");
  const selectedPlan = watch("healthPlanId");

  useEffect(() => {
    if (patient) {
      reset({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        email: patient.email || "",
        birthDate: patient.birthDate || "",
        dni: patient.dni || "",
        address: patient.address || "",
        phoneNumber: patient.phoneNumber || "",
        city: patient.city || "",
        membershipNumber: patient.membershipNumber || "",
        healthInsuranceId: patient.healthInsuranceId?.toString() || "",
        healthPlanId: patient.healthPlanId?.toString() || "",
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
        dni: "",
        address: "",
        phoneNumber: "",
        city: "",
        membershipNumber: "",
        healthInsuranceId: "",
        healthPlanId: "",
      });
      setPlans([]);
    }
  }, [patient, open, reset]);

  useEffect(() => {
    const insuranceId = patient?.healthInsuranceId?.toString();
    if (insuranceId && token) {
      getHealthPlansByInsurance(
        token,
        insuranceId,
        (data) => {
          setPlans(data || []);
          if (patient?.healthPlanId && data.find(p => p.id.toString() === patient.healthPlanId.toString())) {
            setValue("healthPlanId", patient.healthPlanId.toString());
          }
        },
        (err) => {
          setPlans([]);
          errorToast(err?.message || "Error al cargar planes de la obra social del paciente");
        }
      );
    }
  }, [patient, token, setValue]);

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
      (err) => {
        setPlans([]);
        errorToast(err?.message || "Error al cargar planes de la obra social seleccionada");
      }
    );
  }, [selectedInsurance, token, setValue]);

  const onSubmit = (data) => {
    const patientData = {
      ...data,
      id: patient?.id,
      healthInsuranceId: data.healthInsuranceId ? parseInt(data.healthInsuranceId) : null,
      healthPlanId: data.healthPlanId ? parseInt(data.healthPlanId) : null,
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                placeholder="Ingrese el nombre"
                {...register("firstName", patientValidations.firstName)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                placeholder="Ingrese el apellido"
                {...register("lastName", patientValidations.lastName)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
            </div>
          </div>

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
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate", patientValidations.birthDate)}
                className={errors.birthDate ? "border-red-500" : ""}
              />
              {errors.birthDate && <p className="text-red-500 text-xs">{errors.birthDate.message}</p>}
            </div>
          </div>

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
              <Label htmlFor="phoneNumber">Teléfono</Label>
              <Input
                id="phoneNumber"
                placeholder="+54 11 1234-5678"
                {...register("phoneNumber", patientValidations.phoneNumber)}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
            </div>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="membershipNumber">Número de afiliado</Label>
            <Input
              id="membershipNumber"
              placeholder="Número de afiliado"
              {...register("membershipNumber", patientValidations.membershipNumber)}
              className={errors.membershipNumber ? "border-red-500" : ""}
            />
            {errors.membershipNumber && <p className="text-red-500 text-xs">{errors.membershipNumber.message}</p>}
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
