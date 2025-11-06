import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function DoctorFilters({
  selectedProfessional,
  selectedSocial,
  setSelectedProfessional,
  setSelectedSocial,
  handleSearch,
  dentists = [],
  healthInsurances = [],
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      
      <Select value={selectedProfessional || "all"} onValueChange={setSelectedProfessional}>
        <SelectTrigger className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50">
          <SelectValue placeholder="Buscar por Profesional..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los Profesionales</SelectItem>
          {dentists
            .filter(doc => doc.isActive) 
            .map((doc) => (
              <SelectItem key={doc.id} value={`${doc.firstName} ${doc.lastName}`}>
                {doc.firstName} {doc.lastName}
              </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedSocial || "all"} onValueChange={setSelectedSocial}>
        <SelectTrigger className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50">
          <SelectValue placeholder="Buscar por Obra Social..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las Obras Sociales</SelectItem>
          {healthInsurances.map((ins) => (
            <SelectItem key={ins.id} value={ins.id.toString()}>
              {ins.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-end">
        <Button className="w-full" onClick={handleSearch}>
          Buscar
        </Button>
      </div>

    </div>
  );
}

