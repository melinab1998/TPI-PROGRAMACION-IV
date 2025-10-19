import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { successToast, errorToast } from "@/utils/notifications";
import { useForm } from "react-hook-form";
import { updatePasswordValidations } from "@/utils/validations";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import { UpdatePatientPassword } from "@/services/api.services";

export default function UpdatePasswordDialog() {
  const [open, setOpen] = useState(false);
  const { userId, token } = useContext(AuthContext);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    if (!userId || !token) {
      errorToast("No se pudo actualizar la contraseña: usuario no autenticado");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      errorToast("La nueva contraseña y la confirmación no coinciden");
      return;
    }

    UpdatePatientPassword(
      userId,
      token,
      data,
      () => {
        successToast("Contraseña actualizada con éxito");
        setOpen(false);
        reset();
      },
      (err) => {
        if (err?.message) {
          errorToast(err.message);
        } else {
          errorToast("Error al actualizar el correo electrónico");
        }
    
      }
    );
  };

  const inputs = [
    { label: "Contraseña Actual", name: "currentPassword", type: "password", validation: updatePasswordValidations.currentPassword },
    { label: "Nueva Contraseña", name: "newPassword", type: "password", validation: updatePasswordValidations.newPassword },
    { label: "Confirmar Nueva Contraseña", name: "confirmPassword", type: "password", validation: updatePasswordValidations.confirmPassword }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 h-11 gap-2 border-border hover:bg-accent hover:text-accent-foreground">
          Actualizar contraseña
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar contraseña</DialogTitle>
          <DialogDescription>Ingresa tu nueva contraseña.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {inputs.map((input, idx) => (
            <div key={idx} className="space-y-2">
              <Label>{input.label}</Label>
              <Input
                type={input.type}
                {...register(input.name, input.validation)}
                className="border-border focus-visible:ring-primary"
              />
              {errors[input.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[input.name].message}</p>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Actualizar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
