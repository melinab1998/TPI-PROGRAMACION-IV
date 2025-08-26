import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiToothLine } from "react-icons/ri";
import { CgBrackets } from "react-icons/cg";
import { TbMoodSpark } from "react-icons/tb";
import { GiTooth } from "react-icons/gi";
import { FaTooth, FaArrowRight, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: "Odontología General",
      description:
        "Revisiones completas, limpiezas profesionales y tratamientos básicos para mantener tu salud bucal.",
      details:
        "Incluye limpieza, revisión de caries, control de encías y recomendaciones de higiene dental. Ideal para mantener tu salud bucal y prevenir problemas futuros.",
      icon: RiToothLine,
      duration: "30-60 min",
    },
    {
      id: 2,
      title: "Ortodoncia",
      description:
        "Corrección de la posición dental con brackets metálicos, estéticos o alineadores invisibles.",
      details:
        "Tratamiento personalizado con seguimiento mensual. Incluye plan de alineación, ajustes periódicos y revisión de progreso.",
      icon: CgBrackets,
      duration: "6-24 meses",
    },
    {
      id: 3,
      title: "Estética Dental",
      description:
        "Blanqueamientos, carillas y tratamientos para conseguir la sonrisa que siempre has deseado.",
      details:
        "Tratamientos estéticos para mejorar la sonrisa. Incluye diagnóstico previo, aplicación de carillas o blanqueamiento profesional y cuidados posteriores.",
      icon: TbMoodSpark,
      duration: "45-90 min",
    },
    {
      id: 4,
      title: "Tratamiento de Conducto",
      description: "Procedimiento para tratar infecciones dentro del diente y salvarlo.",
      details:
        "Incluye diagnóstico, limpieza del conducto y restauración para salvar el diente afectado.",
      icon: GiTooth,
      duration: "60-90 min",
    },
    {
      id: 5,
      title: "Limpieza Dental Profesional",
      description: "Eliminación de placa y sarro para mantener dientes y encías saludables.",
      details:
        "Limpieza profunda con eliminación de placa y sarro, recomendación de cuidado diario y revisión de encías.",
      icon: FaTooth,
      duration: "45 min",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros Servicios</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Atención odontológica personalizada con tecnología de vanguardia y compromiso profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              variants={cardVariants}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
                <CardHeader className="flex flex-col items-center">
                  <div className="p-3 mb-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-1 flex flex-col justify-between">
                  <p className="text-muted-foreground">{service.description}</p>
                  <Button
                    variant="link"
                    className="mt-4 text-primary hover:no-underline cursor-pointer"
                    onClick={() => setSelectedService(service)}
                  >
                    Más información <FaArrowRight className="inline-block h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                onClick={() => setSelectedService(null)}
              >
                <FaTimes className="h-5 w-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                <selectedService.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">{selectedService.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedService.details}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Duración: {selectedService.duration}
                </p>
                <div className="mt-6">
                  <Button onClick={() => setSelectedService(null)} className="cursor-pointer">Cerrar</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
