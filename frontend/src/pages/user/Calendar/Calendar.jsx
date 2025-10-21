import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import CalendarWidget from "@/components/user/Calendar/CalendarWidget/CalendarWidget";
import TimeSlots from "@/components/user/Calendar/TimeSlots/TimeSlots";
import BookingModal from "@/components/user/Calendar/BookingModal/BookingModal";
import { getAllDentists } from "@/services/api.services";

// Simulación de disponibilidad por dentista
const availability = {
  2: { "2025-10-21": ["09:00", "10:00", "11:00"], "2025-10-22": ["10:00", "11:00"] },
  12: { "2025-10-21": ["10:00", "11:00", "12:00"] },
};

export default function CalendarPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [dentists, setDentists] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [formData, setFormData] = useState({ email: "", motivoConsulta: "Consulta" });

  // Traer dentistas desde backend
  useEffect(() => {
    if (!token) return;

    getAllDentists(
      token,
      (data) => {
        setDentists(data);
      },
      (error) => console.error("Error al cargar dentistas:", error)
    );
  }, [token]);

  // Setear doctor seleccionado
  useEffect(() => {
    if (!dentists.length) return;
    const selectedDoctor = dentists.find((d) => d.id === parseInt(id));
    setDoctor(selectedDoctor);
  }, [dentists, id]);

  if (!doctor) return <p>Doctor no encontrado</p>;

  const doctorAvailability = availability[id] || {};
  const today = new Date();

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
          Seleccionar Turno
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Elige la fecha y horario para tu cita con {doctor.firstName} {doctor.lastName}
        </p>
      </motion.div>

      <div className="rounded-2xl border p-8 shadow-lg bg-card text-card-foreground">
        <div className="flex max-md:flex-col gap-8">
          <CalendarWidget date={date} setDate={setDate} doctorAvailability={doctorAvailability} today={today} />
          <TimeSlots date={date} doctorAvailability={doctorAvailability} time={time} setTime={setTime} />
        </div>
      </div>

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
