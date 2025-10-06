import React from "react";
import Header from "@/components/user/UserHome/Header/Header";
import NextAppointmentCard from "@/components/user/UserHome/NextAppointmentCard/NextAppointmentCard";
import QuickActions from "@/components/user/UserHome/QuickActions/QuickActions";
import { Sparkles, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function UserHome() {
    const userData = {
        name: "María Gomez",
        nextAppointment: {
            date: "15 de Septiembre, 2024",
            time: "10:30 AM",
            dentist: "Dr. Juan Pérez"
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 relative z-10">
                <motion.div initial="hidden" animate="show" variants={fadeInUp}>
                    <Header userName={userData.name} />
                </motion.div>
                <motion.section
                    className="space-y-6"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="p-2 bg-primary/10 rounded-full"
                            whileHover={{ scale: 1.1 }}
                        >
                            <Calendar className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">Próximo turno</h2>
                            <p className="text-muted-foreground">Aquí verás tu próxima cita programada</p>
                        </div>
                    </div>

                    <motion.div initial="hidden" animate="show" variants={fadeInUp}>
                        <NextAppointmentCard appointment={userData.nextAppointment} />
                    </motion.div>
                </motion.section>
                <motion.section
                    className="space-y-8"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="p-2 bg-primary/10 rounded-full"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(59,130,246,0.2)" }}
                        >
                            <Sparkles className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">Acciones rápidas</h2>
                            <p className="text-muted-foreground">Accede rápidamente a las funciones principales</p>
                        </div>
                    </div>

                    <motion.div initial="hidden" animate="show" variants={fadeInUp}>
                        <QuickActions />
                    </motion.div>
                </motion.section>
            </div>
        </div>
    );
}
