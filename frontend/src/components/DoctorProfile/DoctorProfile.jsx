import { motion } from "framer-motion";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function DoctorProfile() {
    return (
        <section className="max-w-4xl mx-auto px-4 mt-5 mb-5">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <Card className="bg-[var(--card)] border-[var(--border)] flex flex-col md:flex-row items-center p-6 gap-6">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?&w=128&h=128&fit=crop" alt="Dra. Erica" />
                        <AvatarFallback>EZ</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="mb-2">Dra. Erica L. Zaghis</CardTitle>
                        <CardDescription>
                            Con más de 15 años de experiencia en odontología general y estética dental,
                            la Dra. Erica se especializa en brindar atención personalizada y de calidad
                            para cada paciente.
                        </CardDescription>
                    </div>
                </Card>
            </motion.div>
        </section>
    );
}


