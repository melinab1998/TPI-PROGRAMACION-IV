import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { successToast } from "@/utils/notifications"

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  dentist
}) {
  if (!dentist) return null

  const isActivating = dentist.status === "inactive"
  const title = isActivating ? "Activar Dentista" : "Desactivar Dentista"
  const actionText = isActivating ? "Activar" : "Desactivar"
  const description = isActivating
    ? "El dentista podrá acceder al sistema nuevamente."
    : "El dentista no podrá acceder al sistema hasta que sea activado nuevamente."

  const handleConfirm = () => {
    onConfirm();
    successToast(`Dentista ${isActivating ? "activado" : "desactivado"} exitosamente`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-lg">
            ¿Estás seguro de que quieres {isActivating ? "activar" : "desactivar"} a{" "}
            <strong>{dentist.first_name} {dentist.last_name}</strong>?
          </p>
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            {description}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant={isActivating ? "default" : "destructive"}
            onClick={handleConfirm}
            className="min-w-24"
          >
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}