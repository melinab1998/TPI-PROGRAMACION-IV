import { useState, useContext, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Header from "@/components/common/Header/Header";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import PatientsList from "@/components/admin/Patients/PatientsList/PatientsList";
import PatientDetailModal from "@/components/admin/Patients/PatientDetailModal/PatientDetailModal";
import PatientFormModal from "@/components/admin/Patients/PatientFormModal/PatientFormModal";
import PatientVisitsModal from "@/components/admin/Patients/PatientVisitsModal/PatientVisitsModal";
import PatientOdontogramModal from "@/components/admin/Patients/PatientOdontogramModal/PatientOdontogramModal";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import {
  getAllPatients,
  CreatePatientByDentist,
  updatePatientByDentist,
  getAllHealthInsurances,
  getAllHealthPlans,
} from "@/services/api.services.js";
import { successToast, errorToast } from "@/utils/notifications.js";
import { useLocation } from "react-router-dom";

export default function PatientsPage() {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isVisitsModalOpen, setIsVisitsModalOpen] = useState(false);
  const [selectedPatientForVisits, setSelectedPatientForVisits] = useState(null);
  const [isOdontogramModalOpen, setIsOdontogramModalOpen] = useState(false);
  const [selectedPatientForOdontogram, setSelectedPatientForOdontogram] = useState(null);
  const [healthInsurances, setHealthInsurances] = useState([]);
  const [healthPlans, setHealthPlans] = useState([]);

  // Cargar pacientes
  useEffect(() => {
    if (!token) return;

    getAllPatients(
      token,
      (response) => {
        setPatients(
          (response || []).map((p) => ({
            id: p.id,
            firstName: p.firstName || p.first_name || "",
            lastName: p.lastName || p.last_name || "",
            dni: p.dni || "",
            email: p.email || "",
            phoneNumber: p.phoneNumber || p.phone_number || "",
            address: p.address || "",
            city: p.city || "",
            membershipNumber: p.membershipNumber || p.membership_number || "",
            birthDate: p.birthDate || p.birth_date || "",
            healthPlanId: p.healthPlanId || p.id_health_plan || null,
            healthPlanName: p.healthPlanName || "",
            healthInsuranceId: p.healthInsuranceId || p.id_health_insurance || null,
            healthInsuranceName: p.healthInsuranceName || "",
          }))
        );
      },
      (err) => {
        errorToast(err?.message || "Error del servidor al cargar los pacientes");
      }
    );
  }, [token]);

  // Cargar obras sociales y planes
  useEffect(() => {
    if (!token) return;

    getAllHealthInsurances(
      token,
      (data) => setHealthInsurances(data || []),
      (err) => errorToast(err?.message || "Error al cargar obras sociales")
    );

    getAllHealthPlans(
      token,
      (data) => setHealthPlans(data || []),
      (err) => errorToast(err?.message || "Error al cargar planes de salud")
    );
  }, [token]);

  // Filtrar pacientes
  const filteredPatients = (patients || []).filter((p) => {
    const firstName = p.firstName || "";
    const lastName = p.lastName || "";
    const dni = p.dni || "";

    return (
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dni.includes(searchTerm)
    );
  });

  // Acciones
  const handleCreatePatient = () => {
    setEditingPatient(null);
    setIsFormModalOpen(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setIsFormModalOpen(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  const handleViewVisits = (patient) => {
    setSelectedPatientForVisits(patient);
    setIsVisitsModalOpen(true);
  };

  const handleViewOdontogram = (patient) => {
    setSelectedPatientForOdontogram(patient);
    setIsOdontogramModalOpen(true);
  };

  const handleSavePatient = (patientData) => {
    const payload = {
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      email: patientData.email,
      dni: patientData.dni,
      birthDate: patientData.birthDate || null,
      address: patientData.address || null,
      phoneNumber: patientData.phoneNumber || null,
      city: patientData.city || null,
      membershipNumber: patientData.membershipNumber || null,
      healthInsuranceId: patientData.healthInsuranceId ? parseInt(patientData.healthInsuranceId) : null,
      healthPlanId: patientData.healthPlanId ? parseInt(patientData.healthPlanId) : null,
    };

    console.log("Payload a enviar:", payload); // Para debug

    if (editingPatient) {
      // Actualizar paciente
      updatePatientByDentist(
        editingPatient.id,
        payload,
        token,
        (updated) => {
          console.log("Paciente actualizado:", updated); // Para debug
          setPatients((prev) =>
            prev.map((p) =>
              p.id === updated.id
                ? {
                  ...p,
                  id: updated.id,
                  firstName: updated.firstName,
                  lastName: updated.lastName,
                  email: updated.email,
                  dni: updated.dni,
                  phoneNumber: updated.phoneNumber,
                  address: updated.address,
                  city: updated.city,
                  birthDate: updated.birthDate,
                  membershipNumber: updated.membershipNumber,
                  healthPlanId: updated.healthPlanId,
                  healthPlanName: updated.healthPlanName,
                  healthInsuranceId: updated.healthInsuranceId,
                  healthInsuranceName: updated.healthInsuranceName,
                }
                : p
            )
          );
        },
        (err) => {
          errorToast(err?.message || "Error al actualizar el paciente");
        }
      );

      return;
    }

    // Crear paciente
    CreatePatientByDentist(
      payload,
      token,
      (response) => {
        console.log("Paciente creado:", response); // Para debug
        setPatients((prev) => [
          ...prev,
          {
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            dni: response.dni,
            email: response.email,
            phoneNumber: response.phoneNumber,
            address: response.address,
            city: response.city,
            membershipNumber: response.membershipNumber,
            birthDate: response.birthDate,
            healthPlanId: response.healthPlanId,
            healthPlanName: response.healthPlanName,
            healthInsuranceId: response.healthInsuranceId,
            healthInsuranceName: response.healthInsuranceName,
          },
        ]);
        successToast("Paciente creado exitosamente");
        setEditingPatient(null);
        setIsFormModalOpen(false);
      },
      (err) => {
        errorToast(err?.message || "Error al crear el paciente");
      }
    );
  };

  // Animaciones
  const fadeSlideDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const fadeSlideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  // Abrir modal automáticamente si viene desde otra página
  const location = useLocation();
  useEffect(() => {
    if (location.state?.openNewPatientModal) {
      setIsFormModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <motion.div variants={fadeSlideDown} initial="hidden" animate="visible">
        <Header
          title="Gestión de Pacientes"
          subtitle="Administra la información de tus pacientes"
          onCreate={handleCreatePatient}
          actionLabel="Nuevo Paciente"
          actionIcon={Plus}
        />
      </motion.div>

      <motion.div variants={fadeSlideDown} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre, apellido o DNI..." />
      </motion.div>

      <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Pacientes ({filteredPatients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientsList
              patients={filteredPatients}
              onView={handleViewPatient}
              onEdit={handleEditPatient}
              onViewVisits={handleViewVisits}
              onViewOdontogram={handleViewOdontogram}
            />
          </CardContent>
        </Card>
      </motion.div>

      <PatientFormModal
        open={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPatient(null);
        }}
        onSave={handleSavePatient}
        patient={editingPatient}
        healthInsurances={healthInsurances}
        healthPlans={healthPlans}
      />

      <PatientDetailModal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onEdit={() => {
          setIsDetailModalOpen(false);
          handleEditPatient(selectedPatient);
        }}
      />

      <PatientVisitsModal
        open={isVisitsModalOpen}
        onClose={() => {
          setIsVisitsModalOpen(false);
          setSelectedPatientForVisits(null);
        }}
        patient={selectedPatientForVisits}
      />

      <PatientOdontogramModal
        open={isOdontogramModalOpen}
        onClose={() => {
          setIsOdontogramModalOpen(false);
          setSelectedPatientForOdontogram(null);
        }}
        patient={selectedPatientForOdontogram}
      />
    </div>
  );
}
