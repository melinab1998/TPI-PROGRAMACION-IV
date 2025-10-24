import React from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { successToast } from "@/utils/notifications";

export default function BookingModal({ time, date, doctor, formData, setFormData, handleSubmit, setTime }) {
    
    const handleConfirmSubmit = (e) => {
        e.preventDefault()
        successToast("Turno confirmado con éxito")
        handleSubmit(e)
    }

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-card text-card-foreground rounded-xl p-7 max-w-md w-full relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
            >
                <button
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
                    onClick={() => setTime(null)}
                >
                    ✕
                </button>

                <h3 className="text-xl font-bold mb-5">Reservar turno - {doctor.name}</h3>

                <div className="mb-6 p-3 bg-muted rounded-lg">
                    <p className="font-medium">
                        {format(date, "EEEE, d 'de' MMMM", { locale: es })} - {time}
                    </p>
                </div>

                <form onSubmit={handleConfirmSubmit} className="space-y-5">
                    <div className="space-y-5">
                        <Label className="text-base">Motivo del turno</Label>
                        <RadioGroup
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, motivoConsulta: value }))}
                            value={formData.motivoConsulta}
                            className="flex space-x-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Consulta" id="r1" />
                                <Label htmlFor="r1">Consulta</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Tratamiento" id="r2" />
                                <Label htmlFor="r2">Tratamiento</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base mt-2">
                        Confirmar Turno
                    </Button>
                </form>
            </motion.div>
        </motion.div>
    )
}