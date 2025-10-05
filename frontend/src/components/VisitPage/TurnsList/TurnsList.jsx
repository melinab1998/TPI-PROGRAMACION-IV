import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import TurnCard from "./TurnCard";

export default function TurnsList({ turns, getVisitRecordForTurn, handleCreateVisitRecord }) {
    const fadeSlideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

    return (
        <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Turnos de Hoy
                    </CardTitle>
                    <CardDescription>Pacientes con turno para hoy</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {turns.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No hay turnos programados para hoy</p>
                        </div>
                    ) : (
                        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                            {turns.map(turn => (
                                <TurnCard 
                                    key={turn.id_turn} 
                                    turn={turn} 
                                    visitRecord={getVisitRecordForTurn(turn.id_turn)}
                                    handleCreateVisitRecord={handleCreateVisitRecord}
                                    fadeSlideUp={fadeSlideUp}
                                />
                            ))}
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
