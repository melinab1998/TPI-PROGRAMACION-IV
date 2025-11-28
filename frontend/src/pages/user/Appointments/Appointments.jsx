import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DoctorFilters from "@/components/user/Appointments/DoctorFilters/DoctorFilters";
import DoctorCard from "@/components/user/Appointments/DoctorCard/DoctorCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllDentists,
  getAllHealthInsurances,
  getHealthInsuranceById,
} from "@/services/api.services";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import { errorToast } from "@/utils/notifications"; 

export default function Appointments() {
  const [dentists, setDentists] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [healthInsurances, setHealthInsurances] = useState([]);
  const [plans, setPlans] = useState([]);

  const [selectedProfessional, setSelectedProfessional] = useState("all");
  const [selectedSocial, setSelectedSocial] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("");

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    getAllDentists(
      token,
      (data) => {
        setDentists(data || []);
        setFilteredDoctors(data || []);
      },
      (err) => errorToast(err.message || "Error al cargar dentistas")
    );
  }, [token]);

  useEffect(() => {
    if (!token) return;

    getAllHealthInsurances(
      token,
      (data) => setHealthInsurances(data || []),
      (err) => errorToast(err.message || "Error al cargar obras sociales")
    );
  }, [token]);

  useEffect(() => {
    if (!selectedSocial || selectedSocial === "all" || !token) {
      setPlans([]);
      setSelectedPlan("");
      return;
    }

    getHealthInsuranceById(
      token,
      selectedSocial,
      (data) => {
        setPlans(data?.plans || []);
        setSelectedPlan("");
      },
      (err) => errorToast(err.message || "Error al cargar planes de salud")
    );
  }, [selectedSocial, token]);

  const handleSearch = () => {
    const prof =
      selectedProfessional && selectedProfessional !== "all"
        ? selectedProfessional.trim().toLowerCase()
        : null;

    const socialId =
      selectedSocial && selectedSocial !== "all"
        ? Number(selectedSocial)
        : null;

    const filtered = (dentists || [])
      .filter((doc) => doc.isActive)
      .filter((doc) => {
        const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
        const matchProfessional = prof ? fullName.includes(prof) : true;

        const matchSocial = socialId
          ? Array.isArray(doc.acceptedInsurances) &&
            doc.acceptedInsurances.some((ins) => ins.id === socialId)
          : true;

        return matchProfessional && matchSocial;
      });

    setFilteredDoctors(filtered);
  };

  useEffect(() => {
    if (!dentists.length) return;
    handleSearch();
  }, [selectedProfessional, selectedSocial, dentists]);

  const hasActiveFilters =
    (selectedProfessional && selectedProfessional !== "all") ||
    (selectedSocial && selectedSocial !== "all");

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
          Reservar Turno
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Encuentra al especialista ideal para tu tratamiento dental
        </p>
      </motion.div>

      <DoctorFilters
        selectedProfessional={selectedProfessional}
        selectedSocial={selectedSocial}
        selectedPlan={selectedPlan}
        setSelectedProfessional={setSelectedProfessional}
        setSelectedSocial={setSelectedSocial}
        setSelectedPlan={setSelectedPlan}
        handleSearch={handleSearch}
        dentists={dentists}
        healthInsurances={healthInsurances}
        plans={plans}
      />

      <AnimatePresence mode="wait">
        {filteredDoctors.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {filteredDoctors.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DoctorCard doctor={doc} navigate={navigate} />
              </motion.div>
            ))}
          </motion.div>
        ) : hasActiveFilters ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-center text-muted-foreground mt-8">
              No hay especialistas que coincidan con la búsqueda.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl text-primary">👨‍⚕️</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Encuentra tu especialista
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Utiliza los filtros para buscar profesionales disponibles
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

