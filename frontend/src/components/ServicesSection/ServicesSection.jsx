import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiToothLine } from "react-icons/ri";
import { FaArrowRight} from "react-icons/fa";
import { TbMoodSpark } from "react-icons/tb";
import { CgBrackets } from "react-icons/cg";


export default function ServicesSection() {
    const servicios = [
        {
            title: "Odontología General",
            description:
                "Revisiones completas, limpiezas profesionales y tratamientos básicos para mantener tu salud bucal.",
            icon: <RiToothLine className="h-10 w-10 text-primary" />,
        },
        {
            title: "Ortodoncia",
            description:
                "Corrección de la posición dental con brackets metálicos, estéticos o alineadores invisibles.",
            icon: <CgBrackets className="h-10 w-10 text-primary" />,
        },
        {
            title: "Estética Dental",
            description:
                "Blanqueamientos, carillas y tratamientos para conseguir la sonrisa que siempre has deseado.",
            icon: <TbMoodSpark className="h-10 w-10 text-primary" />,
        },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Nuestros Servicios
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Atención odontológica personalizada con tecnología de vanguardia y compromiso profesional.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicios.map((servicio) => (
                    <Card
                        key={servicio.title}
                        className="group hover:shadow-lg transition-all duration-300 h-full"
                    >
                        <CardHeader className="flex flex-col items-center">
                            <div className="p-3 mb-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                {servicio.icon}
                            </div>
                            <CardTitle className="text-xl">{servicio.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground">{servicio.description}</p>
                            <Button variant="link" className="mt-6 text-primary hover:no-underline">
                                Más información <FaArrowRight className="inline-block h-4 w-4 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}