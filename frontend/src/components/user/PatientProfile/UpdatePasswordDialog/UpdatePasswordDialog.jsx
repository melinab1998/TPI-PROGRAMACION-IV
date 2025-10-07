import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { successToast } from "@/utils/notifications";
import { useForm } from "react-hook-form";
import { updatePasswordValidations } from "@/utils/validations";

export default function UpdatePasswordDialog({ onUpdate }) {
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        onUpdate(data.newPassword);
        successToast("Contraseña actualizada con éxito");
        setOpen(false);
        reset();
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
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
