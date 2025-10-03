import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, User, Mail, Shield, Users, UserCheck, UserX } from "lucide-react"
import { motion } from "framer-motion"

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
            >
                <div className="space-y-2 mt-5">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        Super Administrador
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Gestión integral de dentistas del sistema
                    </p>
                </div>
                <Button 
                    onClick={handleCreateDentist} 
                    className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Dentista
                </Button>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-background to-muted/10">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">{totalDentists}</div>
                                    <div className="text-sm text-muted-foreground">Total Dentistas</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-background to-muted/10">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/10 rounded-full group-hover:scale-110 transition-transform">
                                    <UserCheck className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">{activeDentists}</div>
                                    <div className="text-sm text-muted-foreground">Activos</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-background to-muted/10">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500/10 rounded-full group-hover:scale-110 transition-transform">
                                    <UserX className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-red-600">{totalDentists - activeDentists}</div>
                                    <div className="text-sm text-muted-foreground">Inactivos</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Barra de búsqueda */}
            <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="px-1" // Un poco de padding para que no quede pegado a los bordes
>
    <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <Input
            placeholder="Buscar por nombre, email o matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg rounded-full border-2 border-border/60 focus:border-primary shadow-lg bg-background/80 backdrop-blur-sm"
        />
    </div>
</motion.div>

            {/* Lista de Dentistas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="border-2 border-border/50 shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold">Dentistas ({filteredDentists.length})</CardTitle>
                        <CardDescription className="text-lg">
                            Lista de todos los dentistas del sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredDentists.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground space-y-4">
                                <Users className="w-16 h-16 mx-auto opacity-50" />
                                <p className="text-xl font-medium">No se encontraron dentistas</p>
                                <p className="text-sm">Intenta con otros términos de búsqueda</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/50">
                                {filteredDentists.map((dentist, index) => (
                                    <motion.div
                                        key={dentist.id_user}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-6 hover:bg-muted/30 transition-all duration-300 group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <User className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-xl text-foreground">
                                                            {dentist.first_name} {dentist.last_name}
                                                        </h3>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-base text-muted-foreground">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-4 h-4" />
                                                                <span>{dentist.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="w-4 h-4" />
                                                                <span>Matrícula: {dentist.license_number}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-muted-foreground">
                                                                Creado: {dentist.created_at}
                                                            </span>
                                                            <Badge 
                                                                variant={dentist.status === "active" ? "default" : "secondary"}
                                                                className="text-sm px-3 py-1"
                                                            >
                                                                {dentist.status === "active" ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditDentist(dentist)}
                                                    className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteConfirm(dentist)}
                                                    className={`flex items-center gap-2 transition-all ${
                                                        dentist.status === "active"
                                                            ? "text-red-600 hover:bg-red-600 hover:text-white border-red-200"
                                                            : "text-green-600 hover:bg-green-600 hover:text-white border-green-200"
                                                    }`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    {dentist.status === "active" ? "Desactivar" : "Activar"}
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Modal de Formulario */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            {editingDentist ? "Editar Dentista" : "Nuevo Dentista"}
                        </DialogTitle>
                    </DialogHeader>
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
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveDentist} className="min-w-24">
                            {editingDentist ? "Guardar" : "Crear"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Confirmación */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {deleteConfirm?.status === "active" ? "Desactivar Dentista" : "Activar Dentista"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-lg">
                            ¿Estás seguro de que quieres {deleteConfirm?.status === "active" ? "desactivar" : "activar"} a{" "}
                            <strong>{deleteConfirm?.first_name} {deleteConfirm?.last_name}</strong>?
                        </p>
                        {deleteConfirm?.status === "active" && (
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
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
                            className="min-w-24"
                        >
                            {deleteConfirm?.status === "active" ? "Desactivar" : "Activar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}