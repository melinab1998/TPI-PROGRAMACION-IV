import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, Clock, Plus, FileText } from "lucide-react"

const mockTurns = [
    {
        id_turn: 1,
        patient_name: "María González",
        patient_dni: "12345678A",
        scheduled_time: "09:00"
    },
    {
        id_turn: 2,
        patient_name: "Carlos Rodríguez",
        patient_dni: "87654321B",
        scheduled_time: "10:30"
    },
    {
        id_turn: 3,
        patient_name: "Ana Martínez",
        patient_dni: "11223344C",
        scheduled_time: "11:15"
    },
    {
        id_turn: 4,
        patient_name: "Pedro López",
        patient_dni: "44332211D",
        scheduled_time: "14:00"
    }
]

const mockVisitRecords = [
    {
        id_visit_record: 1,
        visit_date: new Date().toISOString(),
        treatment: "Limpieza dental completa",
        diagnosis: "Gingivitis leve",
        notes: "Paciente con buena higiene bucal, necesita mejorar técnica de cepillado",
        prescription: "Enjuague bucal con clorhexidina 2 veces al día por 7 días",
        id_turn: 1
    }
]

export default function VisitsPage() {
    const [turns, setTurns] = useState(mockTurns)
    const [visitRecords, setVisitRecords] = useState(mockVisitRecords)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTurn, setSelectedTurn] = useState(null)
    const [showVisitForm, setShowVisitForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [visitData, setVisitData] = useState({
        treatment: "",
        diagnosis: "",
        notes: "",
        prescription: ""
    })

    const filteredTurns = turns.filter(turn =>
        turn.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turn.patient_dni.includes(searchTerm)
    )

    const getVisitRecordForTurn = (turnId) => {
        return visitRecords.find(record => record.id_turn === turnId)
    }

    const handleCreateVisitRecord = (turn) => {
        setSelectedTurn(turn)
        const existingRecord = getVisitRecordForTurn(turn.id_turn)

        if (existingRecord) {
            setVisitData({
                treatment: existingRecord.treatment,
                diagnosis: existingRecord.diagnosis,
                notes: existingRecord.notes,
                prescription: existingRecord.prescription
            })
        } else {
            setVisitData({
                treatment: "",
                diagnosis: "",
                notes: "",
                prescription: ""
            })
        }

        setShowVisitForm(true)
    }

    const handleInputChange = (field, value) => {
        setVisitData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmitVisit = async () => {
        if (!selectedTurn) return

        setIsSubmitting(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const existingRecord = getVisitRecordForTurn(selectedTurn.id_turn)
            const newVisitRecord = {
                id_visit_record: existingRecord ? existingRecord.id_visit_record : Date.now(),
                visit_date: new Date().toISOString(),
                ...visitData,
                id_turn: selectedTurn.id_turn
            }

            if (existingRecord) {
                setVisitRecords(prev =>
                    prev.map(record =>
                        record.id_turn === selectedTurn.id_turn ? newVisitRecord : record
                    )
                )
            } else {
                setVisitRecords(prev => [...prev, newVisitRecord])
            }
            setShowVisitForm(false)
            setSelectedTurn(null)
            alert("Registro de visita guardado exitosamente")

        } catch (error) {
            console.error("Error guardando el registro:", error)
            alert("Error al guardar el registro")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Visitas del Día</h1>
                    <p className="text-muted-foreground mt-1">
                        {new Date().toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Total de turnos: {turns.length}</span>
                </div>
            </div>
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o DNI del paciente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Turnos de Hoy
                            </CardTitle>
                            <CardDescription>
                                Pacientes con turno para hoy
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filteredTurns.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <p>No hay turnos programados para hoy</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredTurns.map((turn) => {
                                        const visitRecord = getVisitRecordForTurn(turn.id_turn)

                                        return (
                                            <div
                                                key={turn.id_turn}
                                                className="p-4 hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="font-semibold text-lg">
                                                                {turn.patient_name}
                                                            </h3>
                                                            {visitRecord && (
                                                                <Badge variant="default" className="bg-green-100 text-green-800">
                                                                    <FileText className="w-3 h-3 mr-1" />
                                                                    Registrado
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4" />
                                                                <span>DNI: {turn.patient_dni}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4" />
                                                                <span>Hora: {turn.scheduled_time}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2 ml-4">
                                                        <Button
                                                            onClick={() => handleCreateVisitRecord(turn)}
                                                            variant={visitRecord ? "outline" : "default"}
                                                            size="sm"
                                                            className="whitespace-nowrap"
                                                        >
                                                            {visitRecord ? (
                                                                <>
                                                                    <FileText className="w-4 h-4 mr-2" />
                                                                    Ver/Editar
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    Crear Registro
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                {showVisitForm && selectedTurn && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    {getVisitRecordForTurn(selectedTurn.id_turn) ? "Editar" : "Nuevo"} Registro
                                </CardTitle>
                                <CardDescription>
                                    Para {selectedTurn.patient_name} - {selectedTurn.scheduled_time}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="treatment">Tratamiento Realizado</Label>
                                    <Textarea
                                        id="treatment"
                                        placeholder="Describa el tratamiento realizado..."
                                        value={visitData.treatment}
                                        onChange={(e) => handleInputChange("treatment", e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="diagnosis">Diagnóstico</Label>
                                    <Textarea
                                        id="diagnosis"
                                        placeholder="Establezca el diagnóstico..."
                                        value={visitData.diagnosis}
                                        onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notas Adicionales</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Observaciones, recomendaciones, etc..."
                                        value={visitData.notes}
                                        onChange={(e) => handleInputChange("notes", e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="prescription">Prescripción Médica</Label>
                                    <Textarea
                                        id="prescription"
                                        placeholder="Medicamentos, dosis, frecuencia..."
                                        value={visitData.prescription}
                                        onChange={(e) => handleInputChange("prescription", e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        onClick={handleSubmitVisit}
                                        disabled={isSubmitting}
                                        className="flex-1"
                                    >
                                        {isSubmitting ? "Guardando..." : "Guardar Registro"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowVisitForm(false)
                                            setSelectedTurn(null)
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {!showVisitForm && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen del Día</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 rounded-lg">
                                        <div className="text-2xl font-bold">
                                            {turns.length}
                                        </div>
                                        <div className="text-sm">Total Turnos</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold">
                                            {visitRecords.length}
                                        </div>
                                        <div className="text-sm">Registros Completados</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}