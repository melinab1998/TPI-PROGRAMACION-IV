import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import Header from "@/components/user/PatientProfile/Header/Header";
import PersonalInfoCard from "@/components/user/PatientProfile/PersonalInfoCard/PersonalInfoCard";
import UpdateEmailDialog from "@/components/user/PatientProfile/UpdateEmailDialog/UpdateEmailDialog";
import UpdatePasswordDialog from "@/components/user/PatientProfile/UpdatePasswordDialog/UpdatePasswordDialog";
import AppointmentsCard from "@/components/user/PatientProfile/AppointmentsCard/AppointmentsCard";
import { getPatientById, getPatientTurns, getAllDentists } from "@/services/api.services";
import { errorToast } from "@/utils/notifications";

export default function PatientProfile() {
  const { userId, token } = useContext(AuthContext);
  const [patientData, setPatientData] = useState({ name: "", surname: "", email: "" });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!userId || !token) return;

    let dentistsMap = {};

    getAllDentists(
      token,
      (dentists) => {
        dentistsMap = dentists.reduce((acc, d) => {
          acc[d.id] = `${d.firstName} ${d.lastName}`;
          return acc;
        }, {});

        getPatientById(
          userId,
          token,
          (data) => {
            setPatientData(data);

            getPatientTurns(
              token,
              data.id,
              (turns) => {
                const completedTurns = turns
                  .filter(t => t.status === "Completed")
                  .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)); 

                const formattedAppointments = completedTurns.map(t => ({
                  id: t.id,
                  date: new Date(t.appointmentDate).toLocaleDateString("es-AR"),
                  time: new Date(t.appointmentDate).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
                  dentist: dentistsMap[t.dentistId] || "Dentista desconocido",
                }));

                setAppointments(formattedAppointments);
              },
              (err) => {
                console.error(err);
                errorToast(err.message || "Error del servidor");
              }
            );
          },
          (err) => {
            console.error(err);
            errorToast(err.message || "Error del servidor");
          }
        );
      },
      (err) => {
        console.error(err);
        errorToast(err.message || "Error del servidor");
      }
    );
  }, [userId, token]);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-10 mt-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Header />
      </motion.div>

      <motion.div className="space-y-6">
        <PersonalInfoCard patientData={patientData} />
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-6 border-t border-border">
          <UpdateEmailDialog currentEmail={patientData.email} onUpdate={newEmail => setPatientData(prev => ({ ...prev, email: newEmail }))} />
          <UpdatePasswordDialog onUpdate={() => {}} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
        <AppointmentsCard appointments={appointments} />
      </motion.div>
    </div>
  );
}
