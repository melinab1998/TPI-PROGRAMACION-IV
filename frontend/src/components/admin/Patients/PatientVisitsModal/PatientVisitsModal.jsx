import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import PatientOdontogramModal from "../PatientOdontogramModal/PatientOdontogramModal";
import { getAllVisitRecords, getAllTurns } from "@/services/api.services";
import { errorToast } from "@/utils/notifications";

export default function PatientVisitsModal({ open, onClose, patient, token }) {
  const [isOdontogramOpen, setIsOdontogramOpen] = useState(false);
  const [visitRecords, setVisitRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitForOdontogram, setSelectedVisitForOdontogram] = useState(null);

  useEffect(() => {
    if (!token || !patient) return;

    const loadVisitsWithTurns = () => {
      setLoading(true);

      getAllTurns(
        token,
        (turnsData) => {
          const safeTurnsData = turnsData || [];

          const patientTurns = safeTurnsData.filter(
            (turn) => turn.patientId === patient.id
          );

          const patientTurnIds = patientTurns.map((turn) => turn.id).filter(Boolean);

          getAllVisitRecords(
            token,
            (visitsData) => {
              const safeVisitsData = visitsData || [];

              const enrichedVisits = safeVisitsData
                .filter(
                  (visit) =>
                    visit &&
                    visit.turnId &&
                    patientTurnIds.includes(visit.turnId)
                )
                .map((visit) => {
                  const relatedTurn = safeTurnsData.find(
                    (turn) => turn.id === visit.turnId
                  );
                  return {
                    ...visit,
                    visit_date: relatedTurn?.appointmentDate || null,
                    turn_status: relatedTurn?.status,
                    consultation_type: relatedTurn?.consultationType,
                  };
                });

              setVisitRecords(enrichedVisits);
              setLoading(false);
            },
            (visitsErr) => {
              errorToast(visitsErr?.message || "Error al cargar visitas");
              setLoading(false);
            }
          );
        },
        (turnsErr) => {
          errorToast(turnsErr?.message || "Error al cargar turns");
          setLoading(false);
        }
      );
    };

    loadVisitsWithTurns();
  }, [token, patient]);

  if (!patient) return null;

  const handleOpenOdontogram = () => {
    if (!visitRecords || visitRecords.length === 0) {
      errorToast("No hay visitas registradas para este paciente");
      return;
    }

    const visitsWithOdonto = visitRecords.filter(
      (v) =>
        v.odontogramData &&
        typeof v.odontogramData === "object" &&
        Object.keys(v.odontogramData).length > 0
    );

    if (visitsWithOdonto.length === 0) {
      errorToast("Este paciente no tiene odontogramas registrados en las visitas");
      return;
    }

    const sorted = [...visitsWithOdonto].sort((a, b) => {
      if (!a.visit_date || !b.visit_date) return 0;
      return new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime();
    });

    setSelectedVisitForOdontogram(sorted[0]);
    setIsOdontogramOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Registros de Visitas - {patient.firstName} {patient.lastName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-end mb-4 gap-2">
            <Button
              size="sm"
              onClick={handleOpenOdontogram}
              variant="outline"
            >
              Ver Odontograma
            </Button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">
                Cargando...
              </p>
            ) : visitRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay registros de visita para este paciente</p>
              </div>
            ) : (
              visitRecords.map((visit) => (
                <div
                  key={visit.id_visit_record || visit.id}
                  className="border rounded-lg p-4 space-y-3 bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {visit.visit_date ? (
                          format(parseISO(visit.visit_date), "dd/MM/yyyy", {
                            locale: es,
                          })
                        ) : (
                          "Fecha no disponible"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {visit.visit_date ? (
                          format(parseISO(visit.visit_date), "HH:mm", {
                            locale: es,
                          })
                        ) : (
                          "Hora no disponible"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground block mb-1">
                        Tratamiento:
                      </span>
                      <p className="text-foreground pl-2 border-l-2 border-primary/20">
                        {visit.treatment}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground block mb-1">
                        Diagnóstico:
                      </span>
                      <p className="text-foreground pl-2 border-l-2 border-primary/20">
                        {visit.diagnosis}
                      </p>
                    </div>
                    {visit.notes && (
                      <div>
                        <span className="font-medium text-muted-foreground block mb-1">
                          Notas:
                        </span>
                        <p className="text-foreground pl-2 border-l-2 border-primary/20">
                          {visit.notes}
                        </p>
                      </div>
                    )}
                    {visit.prescription && (
                      <div>
                        <span className="font-medium text-muted-foreground block mb-1">
                          Prescripción:
                        </span>
                        <p className="text-foreground pl-2 border-l-2 border-primary/20">
                          {visit.prescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <PatientOdontogramModal
        open={isOdontogramOpen && !!selectedVisitForOdontogram}
        onClose={() => {
          setIsOdontogramOpen(false);
          setSelectedVisitForOdontogram(null);
        }}
        patient={patient}
        odontogramData={selectedVisitForOdontogram?.odontogramData}
      />
    </>
  );
}
