import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ServiceModal({ service, onClose }) {
    const Icon = service.icon;

    return (
        <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full relative" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                <div className="flex flex-col items-center text-center">
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <span className="text-sm text-primary font-medium mb-1">{service.category}</span>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{service.details}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Duración aproximada: {service.duration}</p>
                    <div className="mt-6">
                        <Button onClick={onClose} className="cursor-pointer">Cerrar</Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
