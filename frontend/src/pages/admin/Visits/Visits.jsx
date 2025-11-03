import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/admin/Visits/Header/Header";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import TurnsList from "@/components/admin/Visits/TurnsList/TurnsList";
import VisitForm from "@/components/admin/Visits/VisitForm/VisitForm";
import { successToast, errorToast } from "@/utils/notifications";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import { getDentistTurns, getPatientById } from "@/services/api.services";

export default function VisitsPage() {
    console.log("VisitsPage montado");

    const { token, userId } = useContext(AuthContext);
    console.log("Token:", token);
    console.log("UserId:", userId);

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

    // Función para cargar datos del paciente
    const loadPatientData = (patientId) => {
        if (!token || patientsData[patientId]) return;

        getPatientById(
            patientId,
            token,
            (patient) => {
                console.log(`Datos del paciente ${patientId}:`, patient);
                setPatientsData(prev => ({
                    ...prev,
                    [patientId]: {
                        name: `${patient.firstName} ${patient.lastName}`,
                        dni: patient.dni
                    }
                }));
            },
            (err) => {
                console.error(`Error cargando paciente ${patientId}:`, err);
                // Si falla, al menos guardamos el ID como fallback
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

    // ------------------ Cargar turnos ------------------
    useEffect(() => {
        if (!token || !userId) return;

        getDentistTurns(token, userId,
            (fetchedTurns) => {
                console.log("Turnos traídos del back (raw):", fetchedTurns);

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                console.log("Fecha de hoy (normalizada):", today.toLocaleString());

                const todaysTurns = fetchedTurns.filter(turn => {
                    const turnDate = new Date(turn.appointmentDate);
                    turnDate.setHours(0, 0, 0, 0);
                    
                    const isToday = turnDate.getTime() === today.getTime();
                    const isValidStatus = turn.status === 'Pending' || turn.status === 'Completed';
                    
                    console.log(`Turno id ${turn.id} - fecha: ${turnDate.toLocaleString()} - es hoy?`, isToday);
                    console.log(`Turno id ${turn.id} - estado: ${turn.status} - es válido?`, isValidStatus);
                    
                    return isToday && isValidStatus;
                });

                console.log("Turnos filtrados de hoy (solo Pendientes y Completados):", todaysTurns);
                setTurns(todaysTurns);

                // Cargar datos de todos los pacientes de los turnos
                todaysTurns.forEach(turn => {
                    loadPatientData(turn.patientId);
                });
            },
            (err) => {
                errorToast("No se pudieron cargar los turnos.");
                console.error(err);
            }
        );
    }, [token, userId]);

    // Effect para debug
    useEffect(() => {
        console.log("Turnos actualizados:", turns);
        console.log("Datos de pacientes cargados:", patientsData);
    }, [turns, patientsData]);

    // Filtrado temporal - mostrar todos los turnos de hoy
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
        if (!selectedTurn) return;

        const isValid = await trigger(["treatment", "diagnosis"]);
        if (!isValid) {
            errorToast("Por favor, complete los campos obligatorios");
            return;
        }

        setIsSubmitting(true);

        try {
            const existingRecord = getVisitRecordForTurn(selectedTurn.id);
            const newVisitRecord = {
                id_visit_record: existingRecord ? existingRecord.id_visit_record : Date.now(),
                visit_date: new Date().toISOString(),
                ...data,
                id_turn: selectedTurn.id
            };

            setVisitRecords(prev =>
                existingRecord
                    ? prev.map(r => r.id_turn === selectedTurn.id ? newVisitRecord : r)
                    : [...prev, newVisitRecord]
            );

            successToast(
                existingRecord
                    ? "Registro de visita actualizado exitosamente."
                    : "Registro de visita creado exitosamente."
            );

            setShowVisitForm(false);
            setSelectedTurn(null);
            reset();

        } catch (error) {
            console.error(error);
            errorToast("Error al guardar el registro de visita.");
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
            />
        </div>
    );
}