import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { successToast } from "@/utils/notifications";

export default function UpdatePasswordDialog({ onUpdate }) {
    const [open, setOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        onUpdate(newPassword);
        successToast("Contraseña actualizada correctamente");
        setOpen(false);
        
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const inputs = [
        { label: "Contraseña Actual", value: currentPassword, setter: setCurrentPassword },
        { label: "Nueva Contraseña", value: newPassword, setter: setNewPassword },
        { label: "Confirmar Nueva Contraseña", value: confirmPassword, setter: setConfirmPassword }
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
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {inputs.map((input, idx) => (
                        <div key={idx} className="space-y-2">
                            <Label>{input.label}</Label>
                            <Input
                                type="password"
                                value={input.value}
                                onChange={(e) => input.setter(e.target.value)}
                                required
                                className="border-border focus-visible:ring-primary"
                            />
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
