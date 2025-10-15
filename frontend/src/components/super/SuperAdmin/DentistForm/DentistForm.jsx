import { useForm } from "react-hook-form";
import { useState } from "react"; // ✅ Importar useState
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
// ❌ ELIMINAR successToast de aquí
import { dentistValidations } from "@/utils/validations";

export default function DentistForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  isEditing,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Estado para controlar envío

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: formData || {
      first_name: "",
      last_name: "",
      email: "",
      license_number: "",
    },
  });

  // ✅ FUNCIÓN CORREGIDA - Sin toast y con control de doble envío
  const submitHandler = async (data) => {
    // ✅ Prevenir doble envío
    if (isSubmitting) {
      console.log("⚠️ Formulario ya enviándose, ignorando...");
      return;
    }

    console.log("🔄 DentistForm submit llamado");
    setIsSubmitting(true);

    try {
      // ✅ Pasar el control al componente padre (SuperAdminHome)
      await onSubmit(data);

      // ✅ Solo resetear y cerrar si el padre no lanza error
      reset();
      onClose();
    } catch (error) {
      // ✅ El error ya fue manejado por el padre, no hacer nada aquí
      console.log("Error manejado por el componente padre:", error);
    } finally {
      // ✅ Reactivar el formulario
      setIsSubmitting(false);
    }
  };

  // ✅ Función para manejar el cierre correctamente
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
                <Label htmlFor="first_name" className="text-base">
                  Nombre
                </Label>
                <Input
                  id="first_name"
                  className="h-11"
                  placeholder="Ingrese el nombre"
                  {...register("first_name", dentistValidations.first_name)}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-base">
                  Apellido
                </Label>
                <Input
                  id="last_name"
                  className="h-11"
                  placeholder="Ingrese el apellido"
                  {...register("last_name", dentistValidations.last_name)}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="h-11"
                placeholder="Ingrese el email"
                {...register("email", dentistValidations.email)}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_number" className="text-base">
                Matrícula
              </Label>
              <Input
                id="license_number"
                className="h-11"
                placeholder="Ej: MN-12345"
                {...register(
                  "license_number",
                  dentistValidations.license_number
                )}
              />
              {errors.license_number && (
                <p className="text-sm text-red-500">
                  {errors.license_number.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting} // ✅ Deshabilitar durante envío
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="min-w-24"
              disabled={isSubmitting} // ✅ Deshabilitar durante envío
            >
              {isSubmitting ? "Guardando..." : isEditing ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
