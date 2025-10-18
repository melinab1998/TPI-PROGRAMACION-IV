import { useState, useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { motion } from "framer-motion"
import PatientDetailModal from "@/components/admin/Patients/PatientDetailModal/PatientDetailModal"
import PatientFormModal from "@/components/admin/Patients/PatientFormModal/PatientFormModal"
import PatientsList from "@/components/admin/Patients/PatientsList/PatientsList"
import PatientVisitsModal from "@/components/admin/Patients/PatientVisitsModal/PatientVisitsModal"
import PatientOdontogramModal from "@/components/admin/Patients/PatientOdontogramModal/PatientOdontogramModal"
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SearchBar from "@/components/common/SearchBar/SearchBar"
import Header from "@/components/common/Header/Header"
import { AuthContext } from "@/services/auth/AuthContextProvider";
import { CreatePatientByDentist, getAllPatients } from "@/services/api.services.js";
import { successToast, errorToast } from "@/utils/notifications.js";



export default function PatientsPage() {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [editingPatient, setEditingPatient] = useState(null)
  const [isVisitsModalOpen, setIsVisitsModalOpen] = useState(false)
  const [selectedPatientForVisits, setSelectedPatientForVisits] = useState(null)
  const [isOdontogramModalOpen, setIsOdontogramModalOpen] = useState(false)
  const [selectedPatientForOdontogram, setSelectedPatientForOdontogram] = useState(null)

  useEffect(() => {
    if (!token) return;
  
    getAllPatients(
      token,
      (data) => {
        console.log("Datos crudos de la API:", data);
        // Normalizamos cada paciente para que los campos nunca sean undefined
        const normalized = (data || []).map((p) => ({
          ...p,
          first_name: p.first_name || "",
          last_name: p.last_name || "",
          dni: p.dni || "",
          email: p.email || "",
          phone_number: p.phone_number || "",
          address: p.address || "",
          city: p.city || "",
          membership_number: p.membership_number || "",
          birth_date: p.birth_date || "",
          // cualquier otro campo que uses
        }));
        setPatients(normalized);
      },
      (err) => {
        console.error(err);
        errorToast("Error al cargar los pacientes");
      }
    );
  }, [token]);
  
  

  const handleViewVisits = (patient) => {
    setSelectedPatientForVisits(patient)
    setIsVisitsModalOpen(true)
  }

  const handleViewOdontogram = (patient) => {
    setSelectedPatientForOdontogram(patient)
    setIsOdontogramModalOpen(true)
  }

 const filteredPatients = (patients || []).filter(patient =>
  (patient.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (patient.last_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (patient.dni || "").includes(searchTerm)
);


  const handleCreatePatient = () => {
    setEditingPatient(null)
    setIsFormModalOpen(true)
  }

  const handleEditPatient = (patient) => {
    setEditingPatient(patient)
    setIsFormModalOpen(true)
  }

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setIsDetailModalOpen(true)
  }

  const handleSavePatient = (patientData) => {
    if (editingPatient) {
      // Lógica de edición (por ahora solo console.log)
      console.log("Actualizando paciente:", patientData);
      setEditingPatient(null);
      setIsFormModalOpen(false);
      return;
    }

  const payload = {
    FirstName: patientData.first_name,
    LastName: patientData.last_name,
    Email: patientData.email,
    Dni: patientData.dni,
    Address: patientData.address || null,
    PhoneNumber: patientData.phone_number || null,
    City: patientData.city || null,
    MembershipNumber: patientData.membership_number || null,
    BirthDate: patientData.birth_date || null,
  };

  CreatePatientByDentist(
    payload,
    token,
    (response) => {
      setPatients((prev) => [
        ...prev,
        {
          id_user: response.id_user || response.id,
          first_name: response.FirstName || response.first_name,
          last_name: response.LastName || response.last_name,
          email: response.Email || response.email,
          dni: response.Dni || response.dni,
          address: response.Address || response.address,
          phone_number: response.PhoneNumber || response.phone_number,
          city: response.City || response.city,
          membership_number: response.MembershipNumber || response.membership_number,
          birth_date: response.BirthDate || response.birth_date,
        },
      ]);

      successToast("Paciente creado exitosamente");
      setEditingPatient(null);
      setIsFormModalOpen(false);
    },
    (err) => {
      const message = err?.message?.toLowerCase();
      if (message?.includes("email")) {
        errorToast("El email ya está registrado");
      } else if (message?.includes("dni")) {
        errorToast("El DNI ya está registrado");
      } else {
        errorToast("Error del servidor");
      }
    }
  );
};

  const fadeSlideDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
  const fadeSlideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

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
        <div className="relative w-full">
          <SearchBar
            searchTerm={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, apellido o DNI..."
          />
        </div>
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
        onClose={() => { setIsFormModalOpen(false); setEditingPatient(null) }}
        onSave={handleSavePatient}
        patient={editingPatient}
        healthPlans={[]}
      />

      <PatientDetailModal
        open={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setSelectedPatient(null) }}
        patient={selectedPatient}
        onEdit={() => { setIsDetailModalOpen(false); handleEditPatient(selectedPatient) }}
      />

      <PatientVisitsModal
        open={isVisitsModalOpen}
        onClose={() => { setIsVisitsModalOpen(false); setSelectedPatientForVisits(null) }}
        patient={selectedPatientForVisits}
      />

      <PatientOdontogramModal
        open={isOdontogramModalOpen}
        onClose={() => { setIsOdontogramModalOpen(false); setSelectedPatientForOdontogram(null) }}
        patient={selectedPatientForOdontogram}
      />

    </div>
  )
}