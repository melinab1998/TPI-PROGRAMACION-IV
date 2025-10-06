import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import TimeSlot from "../TimeSlot/TimeSlot";

export default function DayRow({ day, slots, errors, timeSlots, onToggleDay, onTimeChange, onAddSlot, onRemoveSlot }) {
    const isEnabled = slots.length > 0;
    const dayHasErrors = slots.some(s => errors[s.id_availability]);
    const fadeSlideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

    return (
        <motion.div variants={fadeSlideUp} initial="hidden" animate="visible"
            className={`grid grid-cols-1 sm:grid-cols-3 items-center gap-4 p-3 border rounded-lg ${dayHasErrors ? 'border-destructive/50 bg-destructive/5' : ''}`}>
            <div className="flex items-center gap-2">
                <Switch checked={isEnabled} onCheckedChange={(c) => onToggleDay(day.id, c)} />
                <Label className="font-medium">{day.name}</Label>
                {dayHasErrors && <AlertCircle className="w-4 h-4 text-destructive" />}
            </div>
            <div className="flex flex-wrap gap-2">
                {isEnabled ? slots.map((slot, i) => (
                    <TimeSlot key={slot.id_availability} slot={slot} errors={errors} timeSlots={timeSlots} onTimeChange={onTimeChange} onRemove={onRemoveSlot} canRemove={slots.length > 1} delay={i * 0.05} />
                )) : <p className="text-sm text-muted-foreground italic">Cerrado</p>}
            </div>
            <div className="flex justify-start sm:justify-end">
                {isEnabled && <PlusButton onClick={() => onAddSlot(day.id)} />}
            </div>
        </motion.div>
    )
}

function PlusButton({ onClick }) {
    return (
        <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80" onClick={onClick}>
            <Plus className="w-4 h-4" /> Agregar
        </button>
    )
}
