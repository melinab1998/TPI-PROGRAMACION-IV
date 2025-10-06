import React from "react";
import { motion } from "framer-motion";

export default function Header({ userName }) {
    return (
        <header className="text-center relative py-6 md:py-8 space-y-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-3"
            >
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    ¡Hola, {userName}!
                </h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-muted-foreground max-w-md mx-auto"
                >
                    Te damos la bienvenida a tu gestión odontológica
                </motion.p>
            </motion.div>
        </header>
    );
}
