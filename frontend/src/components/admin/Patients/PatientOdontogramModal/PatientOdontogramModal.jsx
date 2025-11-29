import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Odontogram from "@/components/admin/Odontogram/Odontogram/Odontogram";
import { FileText, X } from "lucide-react";

export default function PatientOdontogramModal({
  open,
  onClose,
  patient,
  odontogramData,
}) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] w-[95vw] flex flex-col p-0 sm:p-6 overflow-y-auto">
        <DialogHeader className="flex-shrink-0 px-4 sm:px-0 pt-4 sm:pt-0">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-xl">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            Odontograma - {patient.firstName} {patient.lastName}
          </DialogTitle>
        </DialogHeader>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2 sm:hidden h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex-1 min-h-0 overflow-auto px-4 sm:px-0">
          <div className="min-w-max p-4">
            <Odontogram readOnly={true} toothData={odontogramData || {}} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t flex-shrink-0 px-4 sm:px-0 pb-4 sm:pb-0">
          <Button variant="outline" onClick={onClose} className="hidden sm:block">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
