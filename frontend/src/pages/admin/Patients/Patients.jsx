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
            id_user: p.id_user || p.id,
            first_name: p.firstName || p.first_name || "",
            last_name: p.lastName || p.last_name || "",
            dni: p.dni || "",
            email: p.email || p.Email || "",
            phone_number: p.phoneNumber || p.phone_number || "",
            address: p.address || "",
            city: p.city || "",
            membership_number: p.membershipNumber || p.membership_number || "",
            birth_date: p.birthDate || p.birth_date || "",
            healthPlanId: p.healthPlanId || p.id_health_plan || null,
          }))
        );
      },
      (err) => {
        const message = err?.message?.toLowerCase();
        if (message?.includes("paciente") || message?.includes("no se encontraron")) return;
        errorToast("Error del servidor al cargar los pacientes");
      }
    );
  }, [token]);

  // Cargar obras sociales y planes
  useEffect(() => {
    if (!token) return;

    getAllHealthInsurances(
      token,
      (data) => setHealthInsurances(data || []),
      () => errorToast("Error al cargar obras sociales")
    );

    getAllHealthPlans(
      token,
      (data) => setHealthPlans(data || []),
      () => errorToast("Error al cargar planes de salud")
    );
  }, [token]);

  // Filtrar pacientes
  const filteredPatients = (patients || []).filter((p) => {
    const firstName = p.first_name || "";
    const lastName = p.last_name || "";
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

  // Guardar paciente (crear o actualizar)
  const handleSavePatient = (patientData) => {
    const payload = {
      firstName: patientData.first_name || patientData.firstName,
      lastName: patientData.last_name || patientData.lastName,
      email: patientData.email,
      dni: patientData.dni,
      birthDate: patientData.birth_date || patientData.birthDate || null,
      address: patientData.address || null,
      phoneNumber: patientData.phone_number || patientData.phoneNumber || null,
      city: patientData.city || null,
      membershipNumber: patientData.membership_number || patientData.membershipNumber || null,
      healthPlanId: patientData.healthPlanId || patientData.id_health_plan || null,
    };

    if (editingPatient) {
      // Actualizar paciente
      updatePatientByDentist(
        editingPatient.id_user || editingPatient.id,
        payload,
        token,
        (updated) => {
          const patientId = updated.id_user || updated.id;
          setPatients((prev) =>
            prev.map((p) =>
              (p.id_user || p.id) === patientId
                ? {
                    ...p,
                    first_name: updated.firstName || updated.first_name,
                    last_name: updated.lastName || updated.last_name,
                    email: updated.email,
                    dni: updated.dni,
                    phone_number: updated.phoneNumber || updated.phone_number,
                    address: updated.address,
                    city: updated.city,
                    birth_date: updated.birthDate || updated.birth_date,
                    membership_number: updated.membershipNumber || updated.membership_number,
                    healthPlanId: updated.healthPlanId || updated.id_health_plan || null,
                  }
                : p
            )
          );
          successToast("Paciente actualizado exitosamente");
          setEditingPatient(null);
          setIsFormModalOpen(false);
        },
        () => errorToast("Error al actualizar el paciente")
      );
      return;
    }

    // Crear paciente
    CreatePatientByDentist(
      payload,
      token,
      (response) => {
        setPatients((prev) => [
          ...prev,
          {
            id_user: response.id_user || response.id,
            first_name: response.firstName || response.first_name || "",
            last_name: response.lastName || response.last_name || "",
            dni: response.dni || "",
            email: response.email || "",
            phone_number: response.phoneNumber || response.phone_number || "",
            address: response.address || "",
            city: response.city || "",
            membership_number: response.membershipNumber || response.membership_number || "",
            birth_date: response.birthDate || response.birth_date || "",
            healthPlanId: response.healthPlanId || response.id_health_plan || null,
          },
        ]);
        successToast("Paciente creado exitosamente");
        setEditingPatient(null);
        setIsFormModalOpen(false);
      },
      () => errorToast("Error al crear el paciente")
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
