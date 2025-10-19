import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import Header from "@/components/user/PatientProfile/Header/Header";
import PersonalInfoCard from "@/components/user/PatientProfile/PersonalInfoCard/PersonalInfoCard";
import UpdateEmailDialog from "@/components/user/PatientProfile/UpdateEmailDialog/UpdateEmailDialog";
import UpdatePasswordDialog from "@/components/user/PatientProfile/UpdatePasswordDialog/UpdatePasswordDialog";
import { getPatientById } from "@/services/api.services";
import { errorToast } from "@/utils/notifications";

export default function PatientProfile() {
  const { userId, token } = useContext(AuthContext);
  const [patientData, setPatientData] = useState(null);

  // Traer datos del paciente desde el backend
  useEffect(() => {
    if (!userId || !token) return;

    getPatientById(
      userId,
      token,
      (data) => setPatientData(data),
      (err) => {
        console.error(err);
        errorToast("Error al cargar los datos del paciente");
      }
    );
  }, [userId, token]);

  const handleEmailUpdate = (newEmail) => {
    setPatientData((prev) => ({ ...prev, email: newEmail }));
  };

  const handlePasswordUpdate = (newPassword) => {
    console.log("Nueva contraseña:", newPassword);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (!patientData) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-10 mt-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Header />
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={itemVariants}>
          <PersonalInfoCard patientData={patientData} />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mt-4 pt-6 border-t border-border">
          <UpdateEmailDialog currentEmail={patientData.email} onUpdate={handleEmailUpdate} />
          <UpdatePasswordDialog onUpdate={handlePasswordUpdate} />
        </motion.div>
      </motion.div>
    </div>
  );
}
