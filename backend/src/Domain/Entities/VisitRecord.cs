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
            VisitDate = visitDate;
            Treatment = treatment;
            Diagnosis = diagnosis;
            Notes = notes;
            Prescription = prescription;
            TurnId = turnId;
        }
    }
}
