import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { successToast } from "@/utils/notifications";
import { useForm } from "react-hook-form";
import { updateEmailValidations } from "@/utils/validations";

export default function UpdateEmailDialog({ currentEmail, onUpdate }) {
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { email: currentEmail }
    });

    const onSubmit = (data) => {
        onUpdate(data.email);
        successToast("Correo electrónico actualizado con éxito");
        setOpen(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 h-11 gap-2 border-border hover:bg-accent hover:text-accent-foreground">
                    Actualizar correo electrónico
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Actualizar correo electrónico</DialogTitle>
                    <DialogDescription>Ingresa tu nuevo correo electrónico.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Nuevo Email</Label>
                        <Input
                            type="email"
                            {...register("email", updateEmailValidations.email)}
                            className="border-border focus-visible:ring-primary"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit">Actualizar</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}