import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaCalendarAlt } from "react-icons/fa";

const doctorsData = [
  { id: 1, name: "Dr. Juan Pérez", social: "OSDE", phone: "3413333333" },
  { id: 2, name: "Dra. Laura Gómez", social: "Particular", phone: "3413333333" },
  { id: 3, name: "Dr. Martín López", social: "OSDE", phone: "3413333333" },
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

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <Input
            list="professionals"
            value={selectedProfessional}
            onChange={(e) => setSelectedProfessional(e.target.value)}
            placeholder="Buscar por Profesional..."
          />
          <datalist id="professionals">
            {doctorsData.map((doc) => (
              <option key={doc.id} value={doc.name} />
            ))}
          </datalist>
        </div>

        <div>
          <Input
            list="socials"
            value={selectedSocial}
            onChange={(e) => setSelectedSocial(e.target.value)}
            placeholder="Buscar por Obra Social o Particular..."
          />
          <datalist id="socials">
            {[...new Set(doctorsData.map((d) => d.social))].map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className="flex items-end">
          <Button className="w-full" onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </div>

      {/* Resultados */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-all">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${doc.id + 10}`} />
                  <AvatarFallback>👤</AvatarFallback>
                </Avatar>
                <CardTitle>{doc.name}</CardTitle>
                <p className="text-muted-foreground text-sm mt-2">Teléfono: {doc.phone}</p>
              </CardHeader>
              <CardContent className="flex justify-center mt-2">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => navigate(`/calendar/${doc.id}`)}
                >
                  <FaCalendarAlt /> Solicitar Turno
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No hay especialistas que coincidan con la búsqueda.
        </p>
      )}
    </div>
  );
}

