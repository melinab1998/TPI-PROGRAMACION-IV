import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqData = [
    {
        question: "¿Cómo saco un turno?",
        answer: "Podés agendar tu turno en línea a través de nuestra plataforma seleccionando el servicio y horario disponible.",
    },
    {
        question: "¿Atienden obras sociales?",
        answer: "Sí, trabajamos con varias obras sociales y prepagas. Consultanos por la tuya.",
    },
    {
        question: "¿Dónde está ubicada la clínica?",
        answer: "Nuestra clínica se encuentra en el centro de la ciudad, con fácil acceso y estacionamiento cercano.",
    },
];

export default function FAQSection() {
    return (
        <section className="max-w-3xl mx-auto mt-20 px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Preguntas Frecuentes</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqData.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}
