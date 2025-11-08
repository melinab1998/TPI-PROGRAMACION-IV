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

        public VisitRecord() { }

        public VisitRecord(string treatment, string diagnosis, string? notes, string? prescription, int turnId)
        {
            Treatment = treatment;
            Diagnosis = diagnosis;
            Notes = notes;
            Prescription = prescription;
            TurnId = turnId;
        }

        public void UpdateInfo(string? treatment, string? diagnosis, string? notes, string? prescription, int? turnId)
        {
            if (!string.IsNullOrEmpty(treatment)) Treatment = treatment;
            if (!string.IsNullOrEmpty(diagnosis)) Diagnosis = diagnosis;
            if (!string.IsNullOrEmpty(notes)) Notes = notes;
            if (!string.IsNullOrEmpty(prescription)) Prescription = prescription;
            if (turnId.HasValue)
                TurnId = turnId.Value;
        }
    }
}
