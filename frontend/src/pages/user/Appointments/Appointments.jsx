import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorFilters from "@/components/user/Appointments/DoctorFilters/DoctorFilters";
import DoctorCard from "@/components/user/Appointments/DoctorCard/DoctorCard";
import { motion, AnimatePresence } from "framer-motion";

const doctorsData = [
  { id: 1, name: "Dr. Juan Pérez", social: "OSDE" },
  { id: 2, name: "Dra. Laura Gómez", social: "Particular" },
  { id: 3, name: "Dr. Martín López", social: "OSDE" },
];

export default function Appointments() {
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedSocial, setSelectedSocial] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    const prof = selectedProfessional.trim().toLowerCase();
    const social = selectedSocial.trim().toLowerCase();

    const filtered = doctorsData.filter((doc) => {
      const matchProfessional = prof ? doc.name.toLowerCase().includes(prof) : true;
      const matchSocial = social ? doc.social.toLowerCase().includes(social) : true;
      return matchProfessional && matchSocial;
    });

    setFilteredDoctors(filtered);
  };

  const hasActiveFilters = selectedProfessional || selectedSocial;

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
        doctorsData={doctorsData}
        selectedProfessional={selectedProfessional}
        selectedSocial={selectedSocial}
        setSelectedProfessional={setSelectedProfessional}
        setSelectedSocial={setSelectedSocial}
        handleSearch={handleSearch}
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
                <DoctorCard key={doc.id} doctor={doc} navigate={navigate} />
              </motion.div>
            ))}
          </motion.div>
        ) : filteredDoctors.length === 0 && hasActiveFilters ? (
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