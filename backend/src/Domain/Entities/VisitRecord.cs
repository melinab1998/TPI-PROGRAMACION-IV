using Domain.Exceptions;

namespace Domain.Entities
{
    public class VisitRecord
    {
        public int Id { get; set; }
        public string Treatment { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? Prescription { get; set; }
        public int TurnId { get; set; }
        public Turn? Turn { get; set; }

        // NUEVO: JSON crudo del odontograma
        public string? OdontogramData { get; set; }

        public VisitRecord() { }

        public VisitRecord(
            string treatment,
            string diagnosis,
            string? notes,
            string? prescription,
            int turnId,
            string? odontogramData // nuevo parámetro
        )
        {
            Treatment = treatment;
            Diagnosis = diagnosis;
            Notes = notes;
            Prescription = prescription;
            TurnId = turnId;
            OdontogramData = odontogramData;
        }

        public void UpdateInfo(
            string? treatment,
            string? diagnosis,
            string? notes,
            string? prescription,
            int? turnId,
            string? odontogramData // nuevo parámetro
        )
        {
            if (!string.IsNullOrEmpty(treatment)) Treatment = treatment;
            if (!string.IsNullOrEmpty(diagnosis)) Diagnosis = diagnosis;
            if (!string.IsNullOrEmpty(notes)) Notes = notes;
            if (!string.IsNullOrEmpty(prescription)) Prescription = prescription;
            if (turnId.HasValue)
                TurnId = turnId.Value;

            // Si viene null → no tocar; si viene string (incluye "{}") → actualizar
            if (odontogramData is not null)
                OdontogramData = odontogramData;
        }
    }
}

