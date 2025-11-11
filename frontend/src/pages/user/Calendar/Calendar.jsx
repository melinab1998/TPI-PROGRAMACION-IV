import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import CalendarWidget from "@/components/user/Calendar/CalendarWidget/CalendarWidget";
import TimeSlots from "@/components/user/Calendar/TimeSlots/TimeSlots";
import BookingModal from "@/components/user/Calendar/BookingModal/BookingModal";
import { getAllDentists, getAvailableSlots } from "@/services/api.services";
import { AuthContext } from "@/services/auth/AuthContextProvider";

export default function CalendarPage() {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const handleGoBack = () => {
        navigate(-1); 
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
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-12"
            >
                <button
                    onClick={handleGoBack}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/50 rounded-lg transition-all duration-200 hover:bg-primary/5 hover:shadow-sm"
                >
                    <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                        />
                    </svg>
                    Volver
                </button>
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