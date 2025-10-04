import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toastHelper } from "@/utils/notifications";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ContactForm() {
    const handleSubmit = (e) => {
        e.preventDefault();
        toastHelper.success("Mensaje enviado correctamente");
        e.target.reset();
    };

    return (
        <motion.div className="lg:col-span-2" variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}>
            <Card className="h-full flex flex-col shadow-lg rounded-xl border-0 p-0 overflow-hidden">
                <CardContent className="p-8 flex-1 flex flex-col">
                    <motion.div className="flex items-center gap-2 mb-6" variants={itemVariants}>
                        <MessageSquare className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-semibold tracking-tight">Envía un mensaje</h2>
                    </motion.div>

                    <motion.form 
                        className="space-y-6 flex-1 flex flex-col" 
                        variants={containerVariants}
                        onSubmit={handleSubmit}
                    >
                        <motion.div className="space-y-6" variants={itemVariants}>
                            <motion.div className="space-y-3" variants={itemVariants}>
                                <Label htmlFor="name" className="text-base">Nombre completo</Label>
                                <Input 
                                    id="name" 
                                    placeholder="Tu nombre completo" 
                                    className="py-4 px-4 w-full" 
                                    required
                                />
                            </motion.div>

                            <motion.div className="space-y-3" variants={itemVariants}>
                                <Label htmlFor="email" className="text-base">Correo electrónico</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="tu.email@ejemplo.com" 
                                    className="py-4 px-4 w-full" 
                                    required
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div className="space-y-3 flex-1" variants={itemVariants}>
                            <Label htmlFor="message" className="text-base">Mensaje</Label>
                            <Textarea 
                                id="message" 
                                placeholder="Cuéntanos cómo podemos ayudarte..." 
                                className="min-h-[180px] resize-none p-4 w-full" 
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button 
                                type="submit" 
                                className="w-full py-5.5 text-base font-medium mt-2 gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Enviar mensaje
                            </Button>
                        </motion.div>
                    </motion.form>
                </CardContent>
            </Card>
        </motion.div>
    );
}