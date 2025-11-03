import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import CalendarWidget from "@/components/user/Calendar/CalendarWidget/CalendarWidget";
import TimeSlots from "@/components/user/Calendar/TimeSlots/TimeSlots";
import BookingModal from "@/components/user/Calendar/BookingModal/BookingModal";
import { getAllDentists, getAvailableSlots } from "@/services/api.services";
import { AuthContext } from "@/services/auth/AuthContextProvider";

export default function CalendarPage() {
    const { id } = useParams();
    const { token } = useContext(AuthContext); 

    const [doctor, setDoctor] = useState({
        firstName: "",
        lastName: "",
        id: parseInt(id)
    });

    const [doctorAvailability, setDoctorAvailability] = useState({});
    const today = new Date();
    const [date, setDate] = useState(today);
    const [time, setTime] = useState(null);
    const [formData, setFormData] = useState({ email: "", motivoConsulta: "Consulta" });

    useEffect(() => {
        if (!token) return;

        getAllDentists(
            token,
            (data) => {
                const found = data.find(d => d.id === parseInt(id));
                if (found) {
                    setDoctor(found);
                    const startDate = new Date().toISOString().split("T")[0];
                    const nextMonth = new Date();
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    const endDate = nextMonth.toISOString().split("T")[0];

                    getAvailableSlots(
                        token,
                        found.id,
                        startDate,
                        endDate,
                        (avail) => setDoctorAvailability(avail || {}),
                        (err) => console.error("Error cargando disponibilidad:", err)
                    );
                }
            },
            (err) => console.error("Error cargando dentistas:", err)
        );
    }, [id, token]);

    const handleInputChange = (e) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Turno reservado:", {
            doctor: `${doctor.firstName} ${doctor.lastName}`,
            date: format(date, "yyyy-MM-dd"),
            time,
            ...formData,
        });
        setTime(null);
        setFormData({ email: "", motivoConsulta: "Consulta" });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
                    Seleccionar Turno
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Elige la fecha y horario para tu cita con {doctor.firstName} {doctor.lastName}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-8 shadow-lg bg-card text-card-foreground"
            >
                <div className="flex max-md:flex-col gap-18">
                    <CalendarWidget
                        date={date}
                        setDate={setDate}
                        doctorAvailability={doctorAvailability}
                        today={today}
                    />
                    <TimeSlots
                        date={date}
                        doctorAvailability={doctorAvailability}
                        time={time}
                        setTime={setTime}
                    />
                </div>
            </motion.div>

            {time && (
                <BookingModal
                    time={time}
                    date={date}
                    doctor={doctor}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    setTime={setTime}
                />
            )}
        </div>
    );
}
