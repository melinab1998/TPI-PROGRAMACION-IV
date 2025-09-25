import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function LocationMap() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            <Card className="w-full shadow-lg rounded-xl overflow-hidden border-0 p-0">
                <CardContent className="p-0">
                    <div className="px-8 pt-8 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-semibold tracking-tight">Nuestra ubicación</h2>
                        </div>
                    </div>
                    <motion.div
                        className="w-full h-[450px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.867833525148!2d-60.64639392435128!3d-32.95449867228515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab11d0eb49c3%3A0x11f1d3d54f950dd0!2sUniversidad%20Tecnol%C3%B3gica%20Nacional%20%7C%20Facultad%20Regional%20Rosario!5e0!3m2!1ses!2sar!4v1756423268335!5m2!1ses!2sar"
                            className="w-full h-full"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
