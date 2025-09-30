import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, User, Mail, Shield } from "lucide-react"

const mockDentists = [
    {
        id_user: 1,
        first_name: "María",
        last_name: "López",
        email: "maria.lopez@clinica.com",
        license_number: "MN-12345",
        status: "active",
        created_at: "2024-01-15"
    },
    {
        id_user: 2,
        first_name: "Carlos",
        last_name: "Rodríguez",
        email: "carlos.rodriguez@clinica.com",
        license_number: "MN-67890",
        status: "active",
        created_at: "2024-02-10"
    },
    {
        id_user: 3,
        first_name: "Ana",
        last_name: "Martínez",
        email: "ana.martinez@clinica.com",
        license_number: "MN-54321",
        status: "inactive",
        created_at: "2024-01-20"
    }
]

export default function SuperAdminPage() {
    const [dentists, setDentists] = useState(mockDentists)
    const [searchTerm, setSearchTerm] = useState("")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingDentist, setEditingDentist] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        license_number: ""
    })

    const filteredDentists = dentists.filter(dentist =>
        `${dentist.first_name} ${dentist.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dentist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dentist.license_number.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateDentist = () => {
        setEditingDentist(null)
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            license_number: ""
        })
        setIsFormOpen(true)
    }

    const handleEditDentist = (dentist) => {
        setEditingDentist(dentist)
        setFormData({
            first_name: dentist.first_name,
            last_name: dentist.last_name,
            email: dentist.email,
            license_number: dentist.license_number
        })
        setIsFormOpen(true)
    }

    const handleSaveDentist = () => {
        if (editingDentist) {
            setDentists(prev => prev.map(dentist =>
                dentist.id_user === editingDentist.id_user
                    ? { ...dentist, ...formData }
                    : dentist
            ))
        } else {
            const newDentist = {
                id_user: Date.now(),
                ...formData,
                status: "active",
                created_at: new Date().toISOString().split('T')[0]
            }
            setDentists(prev => [...prev, newDentist])
        }
        setIsFormOpen(false)
        setEditingDentist(null)
    }
    const handleToggleStatus = (dentistId) => {
        setDentists(prev => prev.map(dentist =>
            dentist.id_user === dentistId
                ? { ...dentist, status: dentist.status === "active" ? "inactive" : "active" }
                : dentist
        ))
        setDeleteConfirm(null)
    }
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const activeDentists = dentists.filter(dentist => dentist.status === "active").length
    const totalDentists = dentists.length

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Super Administrador</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestión de dentistas del sistema
                    </p>
                </div>
                <Button onClick={handleCreateDentist} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Dentista
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <Shield className="w-8 h-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold">{totalDentists}</div>
                                <div className="text-sm text-muted-foreground">Total Dentistas</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <User className="w-8 h-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold text-primary">{activeDentists}</div>
                                <div className="text-sm text-muted-foreground">Activos</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <User className="w-8 h-8 text-red-600" />
                            <div>
                                <div className="text-2xl font-bold text-red-600">{totalDentists - activeDentists}</div>
                                <div className="text-sm text-muted-foreground">Inactivos</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Barra de búsqueda */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, email o matrícula..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Dentistas ({filteredDentists.length})</CardTitle>
                    <CardDescription>
                        Lista de todos los dentistas del sistema
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredDentists.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No se encontraron dentistas</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredDentists.map((dentist) => (
                                <div key={dentist.id_user} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {dentist.first_name} {dentist.last_name}
                                                    </h3>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="w-4 h-4" />
                                                            <span>{dentist.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Shield className="w-4 h-4" />
                                                            <span>Matrícula: {dentist.license_number}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-muted-foreground">
                                                    Creado: {dentist.created_at}
                                                </span>
                                                <Badge variant={dentist.status === "active" ? "default" : "secondary"}>
                                                    {dentist.status === "active" ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditDentist(dentist)}
                                                className="flex items-center gap-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeleteConfirm(dentist)}
                                                className={`flex items-center gap-2 ${dentist.status === "active"
                                                        ? "text-red-600 hover:text-red-700"
                                                        : "text-primary hover:text-primary"
                                                    }`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {dentist.status === "active" ? "Desactivar" : "Activar"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingDentist ? "Editar Dentista" : "Nuevo Dentista"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">Nombre</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                                    placeholder="Ingrese el nombre"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Apellido</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                                    placeholder="Ingrese el apellido"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Ingrese el email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="license_number">Matrícula</Label>
                            <Input
                                id="license_number"
                                value={formData.license_number}
                                onChange={(e) => handleInputChange("license_number", e.target.value)}
                                placeholder="Ej: MN-12345"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveDentist}>
                            {editingDentist ? "Guardar Cambios" : "Crear Dentista"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {deleteConfirm?.status === "active" ? "Desactivar Dentista" : "Activar Dentista"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p>
                            ¿Estás seguro de que quieres {deleteConfirm?.status === "active" ? "desactivar" : "activar"} a{" "}
                            <strong>{deleteConfirm?.first_name} {deleteConfirm?.last_name}</strong>?
                        </p>
                        {deleteConfirm?.status === "active" && (
                            <p className="text-sm text-muted-foreground">
                                El dentista no podrá acceder al sistema hasta que sea activado nuevamente.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                            Cancelar
                        </Button>
                        <Button
                            variant={deleteConfirm?.status === "active" ? "destructive" : "default"}
                            onClick={() => handleToggleStatus(deleteConfirm.id_user)}
                        >
                            {deleteConfirm?.status === "active" ? "Desactivar" : "Activar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}