import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DentistForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  isEditing 
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  const handleInputChange = (field, value) => {
    onChange(field, value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Editar Dentista" : "Nuevo Dentista"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="first_name" className="text-base">Nombre</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  placeholder="Ingrese el nombre"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="last_name" className="text-base">Apellido</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  placeholder="Ingrese el apellido"
                  className="h-11"
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Ingrese el email"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="license_number" className="text-base">Matrícula</Label>
              <Input
                id="license_number"
                value={formData.license_number}
                onChange={(e) => handleInputChange("license_number", e.target.value)}
                placeholder="Ej: MN-12345"
                className="h-11"
                required
              />
            </div>
          </div>
          <DialogFooter>
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