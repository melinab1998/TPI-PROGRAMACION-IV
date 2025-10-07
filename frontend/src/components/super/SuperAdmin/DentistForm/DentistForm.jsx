import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { successToast } from "@/utils/notifications"
import { dentistValidations } from "@/utils/validations"

export default function DentistForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  isEditing
}) {

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: formData || {
      first_name: "",
      last_name: "",
      email: "",
      license_number: ""
    }
  })

  const submitHandler = (data) => {
    onSubmit(data)
    successToast(`Dentista ${isEditing ? "editado" : "creado"} exitosamente`)
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Editar Dentista" : "Nuevo Dentista"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} noValidate>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-base">Nombre</Label>
                <Input
                  id="first_name"
                  className="h-11"
                  placeholder="Ingrese el nombre"
                  {...register("first_name", dentistValidations.first_name)}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-base">Apellido</Label>
                <Input
                  id="last_name"
                  className="h-11"
                  placeholder="Ingrese el apellido"
                  {...register("last_name", dentistValidations.last_name)}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
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
              <Label htmlFor="license_number" className="text-base">Matrícula</Label>
              <Input
                id="license_number"
                className="h-11"
                placeholder="Ej: MN-12345"
                {...register("license_number", dentistValidations.license_number)}
              />
              {errors.license_number && (
                <p className="text-sm text-red-500">{errors.license_number.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="min-w-24">
              {isEditing ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}