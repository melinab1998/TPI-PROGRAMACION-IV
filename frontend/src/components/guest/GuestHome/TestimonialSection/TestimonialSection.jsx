import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const patients = [
    { name: "Ana", message: "Tuvo una experiencia excelente con nuestro servicio.", image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=faces&fit=crop&w=150&h=150" },
    { name: "Luis", message: "Recibí un trato muy profesional y amable.", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=faces&fit=crop&w=150&h=150" },
    { name: "Carla", message: "El tratamiento fue rápido y sin dolor, totalmente recomendable.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=faces&fit=crop&w=150&h=150" },
];

export default function TestimonialsSection() {
    return (
        <section className="max-w-6xl mx-auto mt-20 px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Nuestros Pacientes</h2>
            <motion.div
                className="flex flex-col md:flex-row gap-6 justify-center items-stretch"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
                {patients.map(({ name, message, image }) => (
                    <motion.div
                        key={name}
                        className="flex-1"
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    >
                        <Card className="flex flex-col h-full bg-[var(--card)] border-[var(--border)] p-6">
                            <CardContent className="flex flex-col items-center text-center h-full">
                                <Avatar className="mb-4">
                                    <AvatarImage src={image} alt={name} />
                                    <AvatarFallback>{name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex mb-2">
                                    {Array(5).fill(0).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-[var(--muted-foreground)] italic">"{message}"</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
