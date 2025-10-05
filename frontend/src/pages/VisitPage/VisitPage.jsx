import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, Clock, Plus, FileText } from "lucide-react"
import Odontogram from "@/components/Odontogram/Odontogram/Odontogram"
import { motion } from "framer-motion"
import { successToast, errorToast } from "@/utils/notifications"

const mockTurns = [
    { id_turn: 1, patient_name: "María González", patient_dni: "12345678A", scheduled_time: "09:00" },
    { id_turn: 2, patient_name: "Carlos Rodríguez", patient_dni: "87654321B", scheduled_time: "10:30" },
    { id_turn: 3, patient_name: "Ana Martínez", patient_dni: "11223344C", scheduled_time: "11:15" },
    { id_turn: 4, patient_name: "Pedro López", patient_dni: "44332211D", scheduled_time: "14:00" }
]

const mockVisitRecords = [
    { id_visit_record: 1, visit_date: new Date().toISOString(), treatment: "Limpieza dental completa", diagnosis: "Gingivitis leve", notes: "Paciente con buena higiene bucal, necesita mejorar técnica de cepillado", prescription: "Enjuague bucal con clorhexidina 2 veces al día por 7 días", id_turn: 1 }
]

export default function VisitsPage() {
    const [turns, setTurns] = useState(mockTurns)
    const [visitRecords, setVisitRecords] = useState(mockVisitRecords)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTurn, setSelectedTurn] = useState(null)
    const [showVisitForm, setShowVisitForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [visitData, setVisitData] = useState({ treatment: "", diagnosis: "", notes: "", prescription: "", odontogramData: {} })

    const filteredTurns = turns.filter(turn =>
        turn.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turn.patient_dni.includes(searchTerm)
    )

    const getVisitRecordForTurn = (turnId) => visitRecords.find(record => record.id_turn === turnId)

    const handleCreateVisitRecord = (turn) => {
        setSelectedTurn(turn)
        const existingRecord = getVisitRecordForTurn(turn.id_turn)
        setVisitData(existingRecord ? {
            treatment: existingRecord.treatment,
            diagnosis: existingRecord.diagnosis,
            notes: existingRecord.notes,
            prescription: existingRecord.prescription,
            odontogramData: existingRecord.odontogramData || {}
        } : { treatment: "", diagnosis: "", notes: "", prescription: "", odontogramData: {} })
        setShowVisitForm(true)
    }

    const handleInputChange = (field, value) => setVisitData(prev => ({ ...prev, [field]: value }))
    const handleOdontogramChange = (data) => setVisitData(prev => ({ ...prev, odontogramData: data }))

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

            setVisitRecords(prev =>
                existingRecord
                    ? prev.map(r => r.id_turn === selectedTurn.id_turn ? newVisitRecord : r)
                    : [...prev, newVisitRecord]
            )

            if (existingRecord) {
                successToast("Registro de visita actualizado exitosamente.")
            } else {
                successToast("Registro de visita creado exitosamente.")
            }

            setShowVisitForm(false)
            setSelectedTurn(null)
        } catch (error) {
            console.error(error)
            errorToast("Error al guardar el registro de visita.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const fadeSlideDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
    const fadeSlideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
    const fadeScale = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <motion.div variants={fadeSlideDown} initial="hidden" animate="visible">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-4">
                            Visitas del Día
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Total de turnos: {turns.length}</span>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={fadeSlideDown} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <div className="relative w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o DNI del paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>
            </motion.div>

            <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" /> Turnos de Hoy
                        </CardTitle>
                        <CardDescription>Pacientes con turno para hoy</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredTurns.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <p>No hay turnos programados para hoy</p>
                            </div>
                        ) : (
                            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                                {filteredTurns.map((turn) => {
                                    const visitRecord = getVisitRecordForTurn(turn.id_turn)
                                    return (
                                        <motion.div key={turn.id_turn} variants={fadeSlideUp} className="p-4 hover:bg-muted/50 transition-colors rounded-md">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-semibold text-lg">{turn.patient_name}</h3>
                                                        {visitRecord && (
                                                            <Badge variant="default" className="bg-primary/10 text-primary">
                                                                <FileText className="w-3 h-3 mr-1" /> Registrado
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2"><User className="w-4 h-4" /> <span>DNI: {turn.patient_dni}</span></div>
                                                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>Hora: {turn.scheduled_time}</span></div>
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
                                                                <FileText className="w-4 h-4 mr-2" /> Ver/Editar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus className="w-4 h-4 mr-2" /> Crear Registro
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {showVisitForm && selectedTurn && (
                <motion.div variants={fadeScale} initial="hidden" animate="visible">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" /> {getVisitRecordForTurn(selectedTurn.id_turn) ? "Editar" : "Nuevo"} Registro
                            </CardTitle>
                            <CardDescription>Para {selectedTurn.patient_name} - {selectedTurn.scheduled_time}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {["treatment", "diagnosis", "notes", "prescription"].map((field) => (
                                <div className="space-y-2" key={field}>
                                    <Label htmlFor={field}>
                                        {field === "treatment" && "Tratamiento Realizado"}
                                        {field === "diagnosis" && "Diagnóstico"}
                                        {field === "notes" && "Notas Adicionales"}
                                        {field === "prescription" && "Prescripción Médica"}
                                    </Label>
                                    <Textarea id={field} placeholder={`Ingrese ${field}...`} value={visitData[field]} onChange={(e) => handleInputChange(field, e.target.value)} rows={3} />
                                </div>
                            ))}
                            <div className="space-y-2">
                                <Label>Odontograma del Paciente</Label>
                                <Odontogram initialData={visitData.odontogramData} onSave={handleOdontogramChange} readOnly={false} />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => { setShowVisitForm(false); setSelectedTurn(null) }} disabled={isSubmitting} className="px-6 py-2">Cancelar</Button>
                                <Button onClick={handleSubmitVisit} disabled={isSubmitting} className="px-6 py-2">
                                    {isSubmitting ? "Guardando..." : "Guardar Registro"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}
