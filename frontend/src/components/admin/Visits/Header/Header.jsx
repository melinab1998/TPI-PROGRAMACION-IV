import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ totalTurns }) {
    const fadeSlideDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

    return (
        <motion.div variants={fadeSlideDown} initial="hidden" animate="visible">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-4">
                        Visitas del Día
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Total de turnos: {totalTurns}</span>
                </div>
            </div>
        </motion.div>
    )
}
