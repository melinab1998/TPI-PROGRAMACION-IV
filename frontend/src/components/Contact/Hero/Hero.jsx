import { motion } from "framer-motion";

export default function Hero() {
    return (
        <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Contáctanos</h1>
            <p className="text-lg max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                Estamos aquí para responder cualquier pregunta sobre nuestros servicios dentales.
                Agenda tu cita o solicita más información.
            </p>
        </motion.div>
    );
}
