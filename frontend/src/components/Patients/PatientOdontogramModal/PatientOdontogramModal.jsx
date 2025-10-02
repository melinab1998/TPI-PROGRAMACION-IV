import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Odontogram from "@/components/Odontogram/Odontogram/Odontogram"
import { FileText } from "lucide-react"

export default function PatientOdontogramModal({ open, onClose, patient }) {
    if (!patient) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Odontograma - {patient.first_name} {patient.last_name}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto min-h-0 p-4">
                    <Odontogram />
                </div>

                <div className="flex justify-end pt-4 border-t flex-shrink-0">
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
