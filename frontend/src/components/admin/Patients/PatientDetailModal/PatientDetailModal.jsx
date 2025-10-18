import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User, Calendar, MapPin, Phone, Mail, FileText } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export default function PatientDetailModal({ open, onClose, patient, onEdit }) {
  if (!patient) return null

  const formattedBirthDate = patient.birthDate
    ? format(parseISO(patient.birthDate), "dd/MM/yyyy")
    : "No especificada"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles del Paciente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
              {patient.firstName?.[0]}{patient.lastName?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h2>
              <p className="text-muted-foreground">DNI: {patient.dni}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Información Personal
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Fecha de Nacimiento:</span>
                <p>{formattedBirthDate}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p>{patient.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contacto
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Teléfono:</span>
                <p>{patient.phoneNumber || "No especificado"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ciudad:</span>
                <p>{patient.city || "No especificada"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Dirección:</span>
                <p>{patient.address || "No especificada"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Obra Social
            </h3>
            <div className="text-sm space-y-2">
              <div>
                <span className="text-muted-foreground">Plan:</span>
                <p>
                  {patient.healthPlan
                    ? `${patient.healthPlan.healthInsurance.name} - ${patient.healthPlan.name}`
                    : "Particular"
                  }
                </p>
              </div>
              {patient.membershipNumber && (
                <div>
                  <span className="text-muted-foreground">N° de Afiliado:</span>
                  <p>{patient.membershipNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cerrar
          </Button>
          <Button onClick={onEdit} className="w-full sm:w-auto">
            Editar Paciente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}