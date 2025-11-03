import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { visitValidations } from "@/utils/validations";

export default function VisitForm({
  selectedTurn,
  showVisitForm,
  handleOdontogramChange,
  watch,
  register,
  errors,
  handleSubmit,
  onSubmit,
  setShowVisitForm,
  isSubmitting,
  getVisitRecordForTurn,
  patientData
}) {
  const fadeScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  if (!showVisitForm || !selectedTurn) return null;

  const existingRecord = getVisitRecordForTurn(selectedTurn.id);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleCancel = () => setShowVisitForm(false);

  return (
    <motion.div variants={fadeScale} initial="hidden" animate="visible">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {existingRecord ? "Editar" : "Nuevo"} Registro
          </CardTitle>
          <CardDescription>
            {patientData
              ? `${patientData.name} - ${new Date(selectedTurn.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : `ID: ${selectedTurn.patientId} - ${new Date(selectedTurn.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="treatment">Tratamiento Realizado *</Label>
              <Textarea
                id="treatment"
                placeholder="Ingrese el tratamiento realizado..."
                {...register("treatment", visitValidations.treatment)}
                className={errors.treatment ? "border-red-500" : ""}
                rows={3}
              />
              {errors.treatment && <p className="text-red-500 text-xs">{errors.treatment.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnóstico *</Label>
              <Textarea
                id="diagnosis"
                placeholder="Ingrese el diagnóstico..."
                {...register("diagnosis", visitValidations.diagnosis)}
                className={errors.diagnosis ? "border-red-500" : ""}
                rows={3}
              />
              {errors.diagnosis && <p className="text-red-500 text-xs">{errors.diagnosis.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales <span className="text-muted-foreground">(opcional)</span></Label>
              <Textarea
                id="notes"
                placeholder="Ingrese notas adicionales..."
                {...register("notes")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prescription">Prescripción Médica <span className="text-muted-foreground">(opcional)</span></Label>
              <Textarea
                id="prescription"
                placeholder="Ingrese la prescripción médica..."
                {...register("prescription")}
                rows={3}
              />
            </div>

            <div className="text-xs text-muted-foreground pt-2">* Campos obligatorios</div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Registro"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
