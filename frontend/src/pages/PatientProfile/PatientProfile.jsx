import { useState } from "react";
import Header from "@/components/PatientProfile/Header/Header";
import PersonalInfoCard from "@/components/PatientProfile/PersonalInfoCard/PersonalInfoCard";
import UpdateEmailDialog from "@/components/PatientProfile/UpdateEmailDialog/UpdateEmailDialog";
import UpdatePasswordDialog from "@/components/PatientProfile/UpdatePasswordDialog/UpdatePasswordDialog";
import AppointmentsCard from "@/components/PatientProfile/AppointmentsCard/AppointmentsCard";

export default function PatientProfile() {
  const [patientData] = useState({
    name: "María",
    lastName: "González",
    dni: "35.678.901",
    email: "maria.gonzalez@example.com"
  });

  const [appointments] = useState([
    { id: 1, date: "15/08/2023", time: "10:30", dentist: "Dra. Laura Martínez" },
    { id: 2, date: "22/06/2023", time: "16:00", dentist: "Dr. Carlos Rodríguez" },
    { id: 3, date: "10/04/2023", time: "11:15", dentist: "Dra. Laura Martínez" }
  ]);

  const handleEmailUpdate = (newEmail) => console.log("Nuevo email:", newEmail);
  const handlePasswordUpdate = (newPassword) => console.log("Nueva contraseña:", newPassword);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-10 mt-10">
      <Header />

      <div className="space-y-6">
        <PersonalInfoCard patientData={patientData} />
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-6 border-t border-border">
          <UpdateEmailDialog currentEmail={patientData.email} onUpdate={handleEmailUpdate} />
          <UpdatePasswordDialog onUpdate={handlePasswordUpdate} />
        </div>
      </div>

      <AppointmentsCard appointments={appointments} />
    </div>
  );
}
