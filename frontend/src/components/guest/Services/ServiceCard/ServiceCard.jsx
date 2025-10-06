import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ServiceCard({ service, onSelect, index }) {
    const Icon = service.icon;
    const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.1, duration: 0.5 }} variants={cardVariants}>
            <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
                <CardHeader className="flex flex-col items-center">
                    <div className="p-3 mb-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-center">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-1 flex flex-col justify-between">
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <Button variant="link" className="text-primary hover:no-underline cursor-pointer" onClick={() => onSelect(service)}>
                        Más información
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
