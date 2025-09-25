import { Card, CardContent } from "@/components/ui/card";
import { User, Phone, Mail, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ContactInfoCard() {
    const infoItems = [
        { icon: <Phone className="w-5 h-5 text-primary" />, title: "Teléfono", value: "+1 (555) 123-4567" },
        { icon: <Mail className="w-5 h-5 text-primary" />, title: "Email", value: "contacto@clinicadental.com" },
        { icon: <MapPin className="w-5 h-5 text-primary" />, title: "Dirección", value: "Av. Principal #123, Ciudad, Estado 12345" },
        { icon: <Clock className="w-5 h-5 text-primary" />, title: "Horario de atención", value: "Lunes a Viernes: 9:00 - 18:00\nSábados: 9:00 - 14:00" }
    ];

    return (
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}>
            <Card className="h-full shadow-lg rounded-xl border-0 p-0 overflow-hidden">
                <CardContent className="p-8 space-y-6">
                    <motion.div className="flex items-center gap-2 mb-4" variants={itemVariants}>
                        <User className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-semibold tracking-tight whitespace-nowrap">
                            Información de contacto
                        </h2>
                    </motion.div>

                    {infoItems.map((item, i) => (
                        <motion.div
                            key={i}
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors whitespace-pre-line"
                            variants={itemVariants}
                        >
                            <div className="bg-primary/10 p-3 rounded-full mt-1">{item.icon}</div>
                            <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-muted-foreground">{item.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}
