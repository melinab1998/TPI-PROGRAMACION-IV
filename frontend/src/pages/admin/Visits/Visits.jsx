import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/admin/Visits/Header/Header";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import TurnsList from "@/components/admin/Visits/TurnsList/TurnsList";
import VisitForm from "@/components/admin/Visits/VisitForm/VisitForm";
import { successToast, errorToast } from "@/utils/notifications";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import { getDentistTurns, getPatientById, createVisitRecord, updateVisitRecord } from "@/services/api.services";

export default function VisitsPage() {
    const { token, userId } = useContext(AuthContext);

    const [turns, setTurns] = useState([]);
    const [visitRecords, setVisitRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTurn, setSelectedTurn] = useState(null);
    const [showVisitForm, setShowVisitForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [patientsData, setPatientsData] = useState({}); // { patientId: { name, dni } }

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
        trigger
    } = useForm({
        defaultValues: {
            treatment: "",
            diagnosis: "",
            notes: "",
            prescription: "",
            odontogramData: {}
        }
    });

    // Cargar datos de paciente
    const loadPatientData = (patientId) => {
        if (!token || patientsData[patientId]) return;

        getPatientById(
            patientId,
            token,
            (patient) => {
                setPatientsData(prev => ({
                    ...prev,
                    [patientId]: {
                        name: `${patient.firstName} ${patient.lastName}`,
                        dni: patient.dni
                    }
                }));
            },
            (err) => {
                console.error(err);
                setPatientsData(prev => ({
                    ...prev,
                    [patientId]: {
                        name: `ID: ${patientId}`,
                        dni: 'No disponible'
                    }
                }));
            }
        );
    };

    // Cargar turnos del dentista
    useEffect(() => {
        if (!token || !userId) return;

        getDentistTurns(token, userId,
            (fetchedTurns) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todaysTurns = fetchedTurns.filter(turn => {
                    const turnDate = new Date(turn.appointmentDate);
                    turnDate.setHours(0, 0, 0, 0);
                    const isToday = turnDate.getTime() === today.getTime();
                    const isValidStatus = turn.status === 'Pending' || turn.status === 'Completed';
                    return isToday && isValidStatus;
                });

                setTurns(todaysTurns);

                // Cargar pacientes
                todaysTurns.forEach(turn => loadPatientData(turn.patientId));
            },
            (err) => {
                errorToast("No se pudieron cargar los turnos.");
                console.error(err);
            }
        );
    }, [token, userId]);

    const filteredTurns = turns;

    const getVisitRecordForTurn = (turnId) =>
        visitRecords.find(record => record.id_turn === turnId);

    const handleCreateVisitRecord = (turn) => {
        setSelectedTurn(turn);
        const existingRecord = getVisitRecordForTurn(turn.id);
        const formData = existingRecord ? { ...existingRecord } : {
            treatment: "",
            diagnosis: "",
            notes: "",
            prescription: "",
            odontogramData: {}
        };
        reset(formData);
        setShowVisitForm(true);
    };

    const handleOdontogramChange = (data) => {
        setValue("odontogramData", data, { shouldValidate: false });
    };

    const onSubmit = async (data) => {
    if (!selectedTurn) {
        errorToast("No hay turno seleccionado");
        return;
    }

    // Validación manual de campos obligatorios
    if (!data.treatment?.trim() || !data.diagnosis?.trim()) {
        errorToast("Por favor, complete tratamiento y diagnóstico");
        return;
    }

    setIsSubmitting(true);

    const existingRecord = getVisitRecordForTurn(selectedTurn.id);

    // Asegúrate que turnId sea número
    const payload = {
        visitDate: new Date().toISOString().split("T")[0],
        treatment: data.treatment.trim(),
        diagnosis: data.diagnosis.trim(),
        notes: data.notes?.trim() || "",
        prescription: data.prescription?.trim() || "",
        turnId: Number(selectedTurn.id) // ← Conversión a número
    };

    console.log("Enviando payload:", payload); // ← Para debug

    const handleSuccess = (savedRecord) => {
        console.log("Respuesta del servidor:", savedRecord);
        
        if (!savedRecord) {
            errorToast("Error: No se recibió respuesta del servidor");
            return;
        }

        // Asegúrate que el registro tenga los campos necesarios
        const processedRecord = {
            ...savedRecord,
            id_turn: savedRecord.turnId || selectedTurn.id
        };

        setVisitRecords(prev =>
            existingRecord
                ? prev.map(r => r.id_turn === selectedTurn.id ? processedRecord : r)
                : [...prev, processedRecord]
        );

        successToast(
            existingRecord
                ? "Registro actualizado exitosamente."
                : "Registro creado exitosamente."
        );

        setShowVisitForm(false);
        setSelectedTurn(null);
        reset();
    };

    const handleError = (err) => {
        console.error("Error detallado:", err);
        let errorMessage = "Error al guardar el registro";
        
        if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err.message) {
            errorMessage = err.message;
        }
        
        errorToast(errorMessage);
    };

    try {
        if (existingRecord && existingRecord.id_visit_record) {
            await updateVisitRecord(
                token, 
                existingRecord.id_visit_record, 
                payload, 
                handleSuccess, 
                handleError
            );
        } else {
            await createVisitRecord(
                token, 
                payload, 
                handleSuccess, 
                handleError
            );
        }
    } catch (error) {
        console.error("Error inesperado:", error);
        errorToast("Error inesperado al procesar la solicitud");
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <Header totalTurns={turns.length} />
            <SearchBar
                searchTerm={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por nombre, apellido o DNI..."
            />
            <TurnsList
                turns={filteredTurns}
                patientsData={patientsData}
                getVisitRecordForTurn={getVisitRecordForTurn}
                handleCreateVisitRecord={handleCreateVisitRecord}
            />
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
                patientData={patientsData[selectedTurn?.patientId]} // <-- aquí
            />
        </div>
    );
}
