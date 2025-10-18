import { useEffect } from "react";
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
import { successToast } from "@/utils/notifications";
import { patientValidations } from "@/utils/validations";

export default function PatientFormModal({
  open,
  onClose,
  onSave,
  patient,
  healthPlans,
}) {
  const isEditing = !!patient;

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
      idHealthPlan: "",
    },
  });

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
        idHealthPlan: patient.idHealthPlan || "",
      });
    } else {
      reset();
    }
  }, [patient, open, reset]);

  const onSubmit = (data) => {
    const patientData = { ...data, id: patient?.id };

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
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                placeholder="Ingrese el apellido"
                {...register("lastName", patientValidations.lastName)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
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
              {errors.dni && (
                <p className="text-red-500 text-xs">{errors.dni.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate", patientValidations.birthDate)}
                className={errors.birthDate ? "border-red-500" : ""}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-xs">
                  {errors.birthDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              {...register("email", patientValidations.email)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Teléfono</Label>
              <Input
                id="phoneNumber"
                placeholder="+54 11 1234-5678"
                {...register("phoneNumber", patientValidations.phoneNumber)}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                placeholder="Ingrese la ciudad"
                {...register("city", patientValidations.city)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              placeholder="Ingrese la dirección completa"
              {...register("address", patientValidations.address)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idHealthPlan">Plan de salud</Label>
              <Select
                onValueChange={(value) => setValue("idHealthPlan", value)}
                defaultValue={watch("idHealthPlan")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un plan" />
                </SelectTrigger>
                <SelectContent>
                  {healthPlans.map((plan) => (
                    <SelectItem
                      key={plan.idHealthPlan}
                      value={plan.idHealthPlan.toString()}
                    >
                      {plan.healthInsurance.name} - {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("idHealthPlan")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="membershipNumber">Número de afiliado</Label>
              <Input
                id="membershipNumber"
                placeholder="Número de afiliado"
                {...register(
                  "membershipNumber",
                  patientValidations.membershipNumber
                )}
                className={errors.membershipNumber ? "border-red-500" : ""}
              />
              {errors.membershipNumber && (
                <p className="text-red-500 text-xs">
                  {errors.membershipNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            * Campos obligatorios
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
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
