using Domain.Exceptions;

namespace Domain.Entities
{
    public class VisitRecord
    {
        public int Id { get; set; }
        public DateOnly VisitDate { get; set; }
        public string Treatment { get; set; }
        public string Diagnosis { get; set; }
        public string? Notes { get; set; }
        public string? Prescription { get; set; }

        // Foreign Key
        public int TurnId { get; set; }

        // Propiedad de navegación
        public Turn? Turn { get; set; }

        public VisitRecord() { }

        public VisitRecord(DateOnly visitDate, string treatment, string diagnosis, string? notes, string? prescription, int turnId)
        {
            if (visitDate > DateOnly.FromDateTime(DateTime.Now))
                throw new AppValidationException("La fecha de la visita no puede ser futura.");

            VisitDate = visitDate;
            Treatment = treatment;
            Diagnosis = diagnosis;
            Notes = notes;
            Prescription = prescription;
            TurnId = turnId;
        }

        public void UpdateInfo(DateOnly? visitDate, string? treatment, string? diagnosis, string? notes, string? prescription, int? turnId)
        {
            if (visitDate.HasValue)
            {
                if (visitDate.Value > DateOnly.FromDateTime(DateTime.Now))
                    throw new AppValidationException("La fecha de la visita no puede ser futura.");

                VisitDate = visitDate.Value;
            }

            if (!string.IsNullOrEmpty(treatment)) Treatment = treatment;
            if (!string.IsNullOrEmpty(diagnosis)) Diagnosis = diagnosis;
            if (!string.IsNullOrEmpty(notes)) Notes = notes;
            if (!string.IsNullOrEmpty(prescription)) Prescription = prescription;
            if (turnId.HasValue)
                TurnId = turnId.Value;
        }
    }

}
