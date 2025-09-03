import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Disponibilidad de ejemplo
const availability = {
  1: {
    "2025-09-02": ["08:00", "09:00", "10:00", "11:00"],
    "2025-09-03": ["09:00", "10:00", "11:00", "12:00"],
    "2025-09-04": ["08:00", "09:30", "11:00", "12:30"],
    "2025-09-05": ["08:00", "09:00", "10:00", "11:00"],
    "2025-09-06": ["09:00", "10:00", "11:00", "12:00"],
  },
};

const doctorsData = [
  { id: 1, name: "Dr. Juan Pérez" },
];

export default function CalendarPage() {
  const { id } = useParams();
  const doctor = doctorsData.find((d) => d.id === parseInt(id));
  const doctorAvailability = availability[id] || {};

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    documento: "",
    fechaNacimiento: "",
  });

  if (!doctor) return <p>Doctor no encontrado</p>;

  // Generar horas de 08:00 a 18:00 cada 30 min
  const allHours = [];
  for (let h = 8; h <= 17; h++) {
    allHours.push(`${h.toString().padStart(2, "0")}:00`);
    allHours.push(`${h.toString().padStart(2, "0")}:30`);
  }

  const dates = Object.keys(doctorAvailability).slice(0, 5); // 5 días

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Turno reservado:", { doctor: doctor.name, ...selectedSlot, ...formData });
    alert("Turno reservado con éxito!");
    setSelectedSlot(null);
    setFormData({ email: "", documento: "", fechaNacimiento: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-xl font-bold mb-6">Disponibilidad de {doctor.name}</h2>

      <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse text-center">
  <thead>
    <tr>
      <th className="border px-6 py-3 min-w-[180px] border-black dark:border-white">Hora / Día</th>
      {dates.map((date) => (
        <th
          key={date}
          className="border px-6 py-3 min-w-[180px] border-black dark:border-white"
        >
          {date}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {allHours.map((hour) => (
      <tr key={hour}>
        <td className="border px-6 py-2 font-semibold border-black dark:border-white">{hour}</td>
        {dates.map((date) => {
          const available = doctorAvailability[date]?.includes(hour);
          return (
            <td
              key={date}
              className={`border px-6 py-2 border-black dark:border-white ${
                available
                  ? "bg-teal-500 text-white dark:bg-teal-600 dark:text-white cursor-pointer hover:bg-teal-600 dark:hover:bg-teal-700"
                  : ""
              }`}
              onClick={() => available && setSelectedSlot({ date, hour })}
            >
              {available ? "Reservar" : "-"}
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
</table>



      </div>

      {/* Modal de Reserva */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                onClick={() => setSelectedSlot(null)}
              >
                <FaTimes className="h-5 w-5" />
              </button>
              <h3 className="text-2xl font-bold mb-4">
                Reservar turno - {doctor.name}
              </h3>
              <p className="mb-4">
                Día: {selectedSlot.date} - Hora: {selectedSlot.hour}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ingrese su email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="documento">Documento</Label>
                  <Input
                    id="documento"
                    name="documento"
                    type="text"
                    placeholder="Ingrese su DNI"
                    required
                    value={formData.documento}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    required
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Confirmar Turno
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
