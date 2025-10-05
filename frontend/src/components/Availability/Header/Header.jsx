import { motion } from "framer-motion";

export default function Header() {
    const fadeSlideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

    return (
        <motion.div variants={fadeSlideUp} initial="hidden" animate="visible">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-4">
                        Configuración de Horarios
                    </h1>
                    <p className="text-muted-foreground mt-1">Establece tus horarios de atención semanales</p>
                </div>
            </div>
        </motion.div>
    )
}
