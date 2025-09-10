import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  RiMedicineBottleLine, 
  RiScissorsCutLine,
  RiSparkling2Line
} from "react-icons/ri";
import { 
  CgBrackets, 
  CgAlignTop,
  CgSmileMouthOpen
} from "react-icons/cg";
import { 
  TbBrush,
  TbStar,
  TbDental
} from "react-icons/tb";
import { 
  FaArrowRight, 
  FaTimes, 
  FaTooth,
  FaCrown
} from "react-icons/fa";
import { 
  GiToothbrush,
  GiTooth
} from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    // Odontología General
    {
      id: 1,
      category: "Odontología General",
      title: "Limpieza Dental Profesional",
      description: "Eliminación de placa y sarro para mantener dientes y encías saludables.",
      details: "Limpieza profunda con eliminación de placa y sarro, recomendación de cuidado diario y revisión de encías.",
      icon: GiToothbrush,
      duration: "45 min",
    },
    {
      id: 2,
      category: "Odontología General",
      title: "Tratamiento de Conducto",
      description: "Procedimiento para tratar infecciones dentro del diente y salvarlo.",
      details: "Incluye diagnóstico, limpieza del conducto y restauración para salvar el diente afectado.",
      icon: RiMedicineBottleLine,
      duration: "60-90 min",
    },
    {
      id: 3,
      category: "Odontología General",
      title: "Extracciones Dentales",
      description: "Remoción segura de dientes dañados o con problemas irreparables.",
      details: "Procedimiento con anestesia local, extracción cuidadosa y recomendaciones post-operatorias.",
      icon: RiScissorsCutLine,
      duration: "30-45 min",
    },

    // Ortodoncia
    {
      id: 4,
      category: "Ortodoncia",
      title: "Brackets Metálicos",
      description: "Sistema tradicional de ortodoncia con brackets de metal de alta calidad.",
      details: "Incluye colocación, ajustes mensuales y seguimiento del progreso de alineación dental.",
      icon: CgBrackets,
      duration: "18-24 meses",
    },
    {
      id: 5,
      category: "Ortodoncia",
      title: "Alineadores Invisibles",
      description: "Tratamiento de ortodoncia invisible con alineadores transparentes removibles.",
      details: "Plan de tratamiento personalizado con alineadores cambiados cada 2 semanas y revisiones periódicas.",
      icon: CgAlignTop,
      duration: "12-18 meses",
    },
    {
      id: 6,
      category: "Ortodoncia",
      title: "Ortodoncia Infantil",
      description: "Tratamiento temprano para corregir problemas de alineación en niños.",
      details: "Evaluación, plan de tratamiento y seguimiento para corregir problemas de mordida y alineación.",
      icon: CgSmileMouthOpen,
      duration: "12-24 meses",
    },

    // Estética Dental
    {
      id: 7,
      category: "Estética Dental",
      title: "Blanqueamiento Dental",
      description: "Aclaramiento dental profesional para una sonrisa más brillante y blanca.",
      details: "Tratamiento con gel blanqueador de alta concentración, activado con luz LED para resultados óptimos.",
      icon: TbStar,
      duration: "60 min",
    },
    {
      id: 8,
      category: "Estética Dental",
      title: "Carillas Porcelana",
      description: "Finas láminas de porcelana que se adhieren a la superficie frontal de los dientes.",
      details: "Incluye diseño de sonrisa, preparación dental y colocación de carillas personalizadas.",
      icon: RiSparkling2Line,
      duration: "2-3 sesiones",
    },
    {
      id: 9,
      category: "Estética Dental",
      title: "Coronas Estéticas",
      description: "Fundas dentales que restauran la forma, tamaño y color de dientes dañados.",
      details: "Coronas de zirconio o porcelana que se adaptan perfectamente a tus dientes naturales.",
      icon: FaCrown,
      duration: "2-3 visitas",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros Servicios</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubre nuestra amplia gama de tratamientos odontológicos especializados.
        </p>
      </div>

      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-foreground border-b pb-2">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  variants={cardVariants}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
                    <CardHeader className="flex flex-col items-center">
                      <div className="p-3 mb-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                      <CardTitle className="text-xl text-center">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center flex-1 flex flex-col justify-between">
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      <Button
                        variant="link"
                        className="text-primary hover:no-underline cursor-pointer"
                        onClick={() => setSelectedService(service)}
                      >
                        Más información
                        <FaArrowRight className="inline-block h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
                <span className="text-sm text-primary font-medium mb-1">{selectedService.category}</span>
                <h3 className="text-2xl font-bold mb-2">{selectedService.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedService.details}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Duración aproximada: {selectedService.duration}
                </p>
                <div className="mt-6">
                  <Button onClick={() => setSelectedService(null)} className="cursor-pointer">
                    Cerrar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}