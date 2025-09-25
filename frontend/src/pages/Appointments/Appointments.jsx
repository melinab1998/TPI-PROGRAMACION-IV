import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorFilters from "@/components/Appointments/DoctorFilters/DoctorFilters";
import DoctorCard from "@/components/Appointments/DoctorCard/DoctorCard";

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Reservar Turno</h1>

      <DoctorFilters
        doctorsData={doctorsData}
        selectedProfessional={selectedProfessional}
        selectedSocial={selectedSocial}
        setSelectedProfessional={setSelectedProfessional}
        setSelectedSocial={setSelectedSocial}
        handleSearch={handleSearch}
      />

      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} navigate={navigate} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8">
          No hay especialistas que coincidan con la búsqueda.
        </p>
      )}
    </div>
  );
}
