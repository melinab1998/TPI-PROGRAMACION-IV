import { useState } from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/VisitPage/Header/Header";
import SearchBar from "@/components/VisitPage/SearchBar/SearchBar";
import TurnsList from "@/components/VisitPage/TurnsList/TurnsList";
import VisitForm from "@/components/VisitPage/VisitForm/VisitForm";
import { successToast, errorToast } from "@/utils/notifications";

const mockTurns = [{ id_turn: 1, patient_name: "María González", patient_dni: "12345678A", scheduled_time: "09:00" }, { id_turn: 2, patient_name: "Carlos Rodríguez", patient_dni: "87654321B", scheduled_time: "10:30" }, { id_turn: 3, patient_name: "Ana Martínez", patient_dni: "11223344C", scheduled_time: "11:15" }, { id_turn: 4, patient_name: "Pedro López", patient_dni: "44332211D", scheduled_time: "14:00" }] 
const mockVisitRecords = [{ id_visit_record: 1, visit_date: new Date().toISOString(), treatment: "Limpieza dental completa", diagnosis: "Gingivitis leve", notes: "Paciente con buena higiene bucal, necesita mejorar técnica de cepillado", prescription: "Enjuague bucal con clorhexidina 2 veces al día por 7 días", id_turn: 1 }]

export default function VisitsPage() {
    const [turns, setTurns] = useState(mockTurns);
    const [visitRecords, setVisitRecords] = useState(mockVisitRecords);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTurn, setSelectedTurn] = useState(null);
    const [showVisitForm, setShowVisitForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        defaultValues: {
            treatment: "",
            diagnosis: "",
            notes: "",
            prescription: "",
            odontogramData: {}
        }
    });

    const filteredTurns = turns.filter(turn =>
        turn.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turn.patient_dni.includes(searchTerm)
    );

    const getVisitRecordForTurn = (turnId) => visitRecords.find(record => record.id_turn === turnId);

    const handleCreateVisitRecord = (turn) => {
        setSelectedTurn(turn)
        const existingRecord = getVisitRecordForTurn(turn.id_turn)
        const formData = existingRecord ? existingRecord : { treatment: "", diagnosis: "", notes: "", prescription: "", odontogramData: {} }
        reset(formData)
        setShowVisitForm(true)
    }

    const handleOdontogramChange = (data) => setValue("odontogramData", data);

    const onSubmit = async (data) => {
        if (!selectedTurn) return;
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const existingRecord = getVisitRecordForTurn(selectedTurn.id_turn);
            const newVisitRecord = { id_visit_record: existingRecord ? existingRecord.id_visit_record : Date.now(), visit_date: new Date().toISOString(), ...data, id_turn: selectedTurn.id_turn };
            setVisitRecords(prev => existingRecord ? prev.map(r => r.id_turn === selectedTurn.id_turn ? newVisitRecord : r) : [...prev, newVisitRecord]);
            successToast(existingRecord ? "Registro de visita actualizado exitosamente." : "Registro de visita creado exitosamente.");
            setShowVisitForm(false);
            setSelectedTurn(null);
        } catch (error) {
            console.error(error);
            errorToast("Error al guardar el registro de visita.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <Header totalTurns={turns.length} />
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <TurnsList turns={filteredTurns} getVisitRecordForTurn={getVisitRecordForTurn} handleCreateVisitRecord={handleCreateVisitRecord} />
            <VisitForm
                selectedTurn={selectedTurn}
                showVisitForm={showVisitForm}
                handleOdontogramChange={handleOdontogramChange}
                watch={watch}
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                setShowVisitForm={setShowVisitForm}
                isSubmitting={isSubmitting}
                getVisitRecordForTurn={getVisitRecordForTurn}
            />
        </div>
    )
}

