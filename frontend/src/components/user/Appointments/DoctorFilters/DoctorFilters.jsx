import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function DoctorFilters({
  selectedProfessional,
  selectedSocial,
  selectedPlan,
  setSelectedProfessional,
  setSelectedSocial,
  setSelectedPlan,
  handleSearch,
  dentists,
  healthInsurances,
  plans,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Profesional */}
      <Select value={selectedProfessional || ""} onValueChange={setSelectedProfessional}>
        <SelectTrigger className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50">
          <SelectValue placeholder="Buscar por Profesional..." />
        </SelectTrigger>
        <SelectContent>
          {dentists.map((doc) => (
             <SelectItem key={doc.id} value={`${doc.firstName} ${doc.lastName}`}>
             {doc.firstName} {doc.lastName}
           </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Obra Social */}
      <Select value={selectedSocial || ""} onValueChange={setSelectedSocial}>
        <SelectTrigger className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50">
          <SelectValue placeholder="Buscar por Obra Social..." />
        </SelectTrigger>
        <SelectContent>
          {healthInsurances.map((ins) => (
            <SelectItem key={ins.id} value={ins.id.toString()}>
              {ins.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Plan */}
      <Select value={selectedPlan || ""} onValueChange={setSelectedPlan} disabled={!selectedSocial}>
        <SelectTrigger className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50">
          <SelectValue placeholder="Seleccionar Plan..." />
        </SelectTrigger>
        <SelectContent>
          {plans.map((plan) => (
            <SelectItem key={plan.id} value={plan.id.toString()}>
              {plan.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Botón */}
      <div className="flex items-end">
        <Button className="w-full" onClick={handleSearch}>
          Buscar
        </Button>
      </div>
    </div>
  );
}
