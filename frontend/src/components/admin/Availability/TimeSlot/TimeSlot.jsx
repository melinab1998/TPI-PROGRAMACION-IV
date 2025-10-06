import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TimeSlot({ slot, errors, timeSlots, onTimeChange, onRemove, canRemove, delay }) {
    const hasError = errors[slot.id_availability];
    const fadeSlideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

    return (
        <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay }}>
            <div className={`flex flex-col gap-1 bg-muted/30 rounded-lg p-2 ${hasError ? 'border border-destructive/50 bg-destructive/5' : ''}`}>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Select value={slot.start_time} onValueChange={(v) => onTimeChange(slot.id_availability, "start_time", v)}>
                            <SelectTrigger className={`w-20 ${hasError ? 'border-destructive' : ''}`}><SelectValue /></SelectTrigger>
                            <SelectContent className="max-h-60">{timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                        <span>-</span>
                        <Select value={slot.end_time} onValueChange={(v) => onTimeChange(slot.id_availability, "end_time", v)}>
                            <SelectTrigger className={`w-20 ${hasError ? 'border-destructive' : ''}`}><SelectValue /></SelectTrigger>
                            <SelectContent className="max-h-60">{timeSlots.filter(t => t > slot.start_time).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    {canRemove && (
                        <Button variant="ghost" size="icon" onClick={() => onRemove(slot.id_availability)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                    )}
                </div>
                {hasError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {hasError}
                    </p>
                )}
            </div>
        </motion.div>
    )
}
