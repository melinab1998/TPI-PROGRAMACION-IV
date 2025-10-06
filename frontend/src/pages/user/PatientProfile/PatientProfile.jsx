import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/user/PatientProfile/Header/Header";
import PersonalInfoCard from "@/components/user/PatientProfile/PersonalInfoCard/PersonalInfoCard";
import UpdateEmailDialog from "@/components/user/PatientProfile/UpdateEmailDialog/UpdateEmailDialog";
import UpdatePasswordDialog from "@/components/user/PatientProfile/UpdatePasswordDialog/UpdatePasswordDialog";
import AppointmentsCard from "@/components/user/PatientProfile/AppointmentsCard/AppointmentsCard";

export default function PatientProfile() {
  const [patientData] = useState({
    name: "María",
    lastName: "González",
    dni: "35.678.901",
    email: "maria.gonzalez@example.com",
  });

  const [appointments] = useState([
    { id: 1, date: "15/08/2023", time: "10:30", dentist: "Dra. Laura Martínez" },
    { id: 2, date: "22/06/2023", time: "16:00", dentist: "Dr. Carlos Rodríguez" },
    { id: 3, date: "10/04/2023", time: "11:15", dentist: "Dra. Laura Martínez" },
  ]);

  const handleEmailUpdate = (newEmail) => console.log("Nuevo email:", newEmail);
  const handlePasswordUpdate = (newPassword) => console.log("Nueva contraseña:", newPassword);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-10 mt-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Header />
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <PersonalInfoCard patientData={patientData} />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 mt-4 pt-6 border-t border-border"
        >
          <UpdateEmailDialog
            currentEmail={patientData.email}
            onUpdate={handleEmailUpdate}
          />
          <UpdatePasswordDialog onUpdate={handlePasswordUpdate} />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <AppointmentsCard appointments={appointments} />
      </motion.div>
    </div>
  );
}
