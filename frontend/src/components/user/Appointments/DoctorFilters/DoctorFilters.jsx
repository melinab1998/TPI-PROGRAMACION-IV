import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function DoctorFilters({
    doctorsData,
    selectedProfessional,
    selectedSocial,
    setSelectedProfessional,
    setSelectedSocial,
    handleSearch,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Select onValueChange={(value) => setSelectedProfessional(value)} value={selectedProfessional}>
                <SelectTrigger className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50">
                    <SelectValue placeholder="Buscar por Profesional..." />
                </SelectTrigger>
                <SelectContent>
                    {doctorsData.map((doc) => (
                        <SelectItem key={doc.id} value={doc.name}>{doc.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select onValueChange={(value) => setSelectedSocial(value)} value={selectedSocial}>
                <SelectTrigger className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50">
                    <SelectValue placeholder="Buscar por Obra Social o Particular..." />
                </SelectTrigger>
                <SelectContent>
                    {[...new Set(doctorsData.map((d) => d.social))].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex items-end">
                <Button className="w-full" onClick={handleSearch}>Buscar</Button>
            </div>
        </div>
    );
}
