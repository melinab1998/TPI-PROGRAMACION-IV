import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dentistValidations } from "@/utils/validations";

export default function DentistForm({ isOpen, onClose, onSubmit, dentist }) {
  const isEditing = !!dentist;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      licenseNumber: "",
    },
  });

  // Resetea los valores cada vez que cambie el dentista a editar o se abra el modal
  useEffect(() => {
    if (dentist) {
      reset({
        firstName: dentist.first_name || "",
        lastName: dentist.last_name || "",
        email: dentist.email || "",
        licenseNumber: dentist.license_number || "",
      });
    } else {
      reset();
    }
  }, [dentist, isOpen, reset]);

  const submitHandler = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.log("Error manejado por el componente padre:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Editar Dentista" : "Nuevo Dentista"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifique los datos del dentista"
              : "Complete los datos del nuevo dentista"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} noValidate>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base">Nombre</Label>
                <Input
                  id="firstName"
                  placeholder="Ingrese el nombre"
                  className={errors.firstName ? "border-red-500" : ""}
                  {...register("firstName", dentistValidations.firstName)}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-base">Apellido</Label>
                <Input
                  id="lastName"
                  placeholder="Ingrese el apellido"
                  className={errors.lastName ? "border-red-500" : ""}
                  {...register("lastName", dentistValidations.lastName)}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingrese el email"
                className={errors.email ? "border-red-500" : ""}
                {...register("email", dentistValidations.email)}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-base">Matrícula</Label>
              <Input
                id="licenseNumber"
                placeholder="Ej: MN-12345"
                className={errors.licenseNumber ? "border-red-500" : ""}
                {...register("licenseNumber", dentistValidations.licenseNumber)}
              />
              {errors.licenseNumber && (
                <p className="text-sm text-red-500">{errors.licenseNumber.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="min-w-24" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
