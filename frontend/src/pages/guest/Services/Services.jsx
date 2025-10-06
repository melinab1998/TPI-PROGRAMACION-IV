import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; 
import ServiceCard from "@/components/guest/Services/ServiceCard/ServiceCard";
import ServiceModal from "@/components/guest/Services/ServiceModal/ServiceModal";
import { GiToothbrush } from "react-icons/gi";
import { RiMedicineBottleLine, RiScissorsCutLine, RiSparkling2Line } from "react-icons/ri";
import { CgBrackets, CgAlignTop, CgSmileMouthOpen } from "react-icons/cg";
import { TbStar } from "react-icons/tb";
import { FaCrown } from "react-icons/fa";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { id: 1, category: "Odontología General", title: "Limpieza Dental Profesional", description: "Eliminación de placa y sarro para mantener dientes y encías saludables.", details: "Limpieza profunda con eliminación de placa y sarro, recomendación de cuidado diario y revisión de encías.", icon: GiToothbrush, duration: "45 min" },
    { id: 2, category: "Odontología General", title: "Tratamiento de Conducto", description: "Procedimiento para tratar infecciones dentro del diente y salvarlo.", details: "Incluye diagnóstico, limpieza del conducto y restauración para salvar el diente afectado.", icon: RiMedicineBottleLine, duration: "60-90 min" },
    { id: 3, category: "Odontología General", title: "Extracciones Dentales", description: "Remoción segura de dientes dañados o con problemas irreparables.", details: "Procedimiento con anestesia local, extracción cuidadosa y recomendaciones post-operatorias.", icon: RiScissorsCutLine, duration: "30-45 min" },
    { id: 4, category: "Ortodoncia", title: "Brackets Metálicos", description: "Sistema tradicional de ortodoncia con brackets de metal de alta calidad.", details: "Incluye colocación, ajustes mensuales y seguimiento del progreso de alineación dental.", icon: CgBrackets, duration: "18-24 meses" },
    { id: 5, category: "Ortodoncia", title: "Alineadores Invisibles", description: "Tratamiento de ortodoncia invisible con alineadores transparentes removibles.", details: "Plan de tratamiento personalizado con alineadores cambiados cada 2 semanas y revisiones periódicas.", icon: CgAlignTop, duration: "12-18 meses" },
    { id: 6, category: "Ortodoncia", title: "Ortodoncia Infantil", description: "Tratamiento temprano para corregir problemas de alineación en niños.", details: "Evaluación, plan de tratamiento y seguimiento para corregir problemas de mordida y alineación.", icon: CgSmileMouthOpen, duration: "12-24 meses" },
    { id: 7, category: "Estética Dental", title: "Blanqueamiento Dental", description: "Aclaramiento dental profesional para una sonrisa más brillante y blanca.", details: "Tratamiento con gel blanqueador de alta concentración, activado con luz LED para resultados óptimos.", icon: TbStar, duration: "60 min" },
    { id: 8, category: "Estética Dental", title: "Carillas Porcelana", description: "Finas láminas de porcelana que se adhieren a la superficie frontal de los dientes.", details: "Incluye diseño de sonrisa, preparación dental y colocación de carillas personalizadas.", icon: RiSparkling2Line, duration: "2-3 sesiones" },
    { id: 9, category: "Estética Dental", title: "Coronas Estéticas", description: "Fundas dentales que restauran la forma, tamaño y color de dientes dañados.", details: "Coronas de zirconio o porcelana que se adaptan perfectamente a tus dientes naturales.", icon: FaCrown, duration: "2-3 visitas" },
  ];

  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Nuestros Servicios
        </motion.h2>

        <motion.p
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Descubre nuestra amplia gama de tratamientos odontológicos especializados.
        </motion.p>
      </div>

      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-foreground border-b pb-2">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} onSelect={setSelectedService} />
            ))}
          </div>
        </div>
      ))}

      <AnimatePresence>
        {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />}
      </AnimatePresence>
    </section>
  );
}
