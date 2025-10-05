import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function WeeklySummary({ daysOfWeek, availabilities, errors }) {
    const fadeSlideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

    const getDaySlots = (dayId) => availabilities.filter(a => a.day_of_week === dayId);

    return (
        <motion.div variants={fadeSlideUp} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                {daysOfWeek.map(day => {
                    const daySlots = getDaySlots(day.id);
                    const dayHasErrors = daySlots.some(s => errors[s.id_availability]);
                    return (
                        <motion.div key={day.id} variants={fadeSlideUp} initial="hidden" animate="visible"
                            className={`text-center p-3 border rounded-lg ${dayHasErrors ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                            <div className="font-medium mb-2">{day.label}</div>
                            {daySlots.length > 0 ? (
                                <div className="space-y-1">
                                    {daySlots.map((slot, i) => {
                                        const hasError = errors[slot.id_availability];
                                        return (
                                            <motion.div key={i} variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: i * 0.05 }}
                                                className={`text-xs px-2 py-1 rounded ${hasError ? 'bg-destructive/20 text-destructive border border-destructive/30' : 'bg-primary/90 text-primary-foreground'}`}>
                                                {slot.start_time} - {slot.end_time} {hasError && <AlertCircle className="w-3 h-3 inline ml-1" />}
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            ) : <div className="text-xs text-muted-foreground italic">Cerrado</div>}
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}
