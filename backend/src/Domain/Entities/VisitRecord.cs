namespace Domain.Entities;

public class VisitRecord
{
    public int Id { get; set; }

    public DateOnly VisitDate { get; set; }

    public string Treatment { get; set; }

    public string Diagnosis { get; set; }

    public string? Notes { get; set; }

    public string? Prescription { get; set; }

    //Foreign Key
    public int TurnId { get; set; }

    // Propiedad de navegación
    public Turn? Turn { get; set; }

    public VisitRecord() { }

    public VisitRecord(DateOnly visitDate, string treatment, string diagnosis, string notes, string prescription, int turnId)
    {

        ValidateVisitDate(visitDate);
        ValidateTextFields(treatment, diagnosis);
    


        VisitDate = visitDate;
        Treatment = treatment;
        Diagnosis = diagnosis;
        Notes = notes;
        Prescription = prescription;
        TurnId = turnId;
    }

    private static void ValidateVisitDate(DateOnly date)
        {
            if (date > DateOnly.FromDateTime(DateTime.Now))
                throw new ArgumentException("La fecha de la visita no puede ser futura.");
        }

        private static void ValidateTextFields(string treatment, string diagnosis)
        {
            if (string.IsNullOrWhiteSpace(treatment))
                throw new ArgumentException("El tratamiento no puede estar vacío.");

            if (string.IsNullOrWhiteSpace(diagnosis))
                throw new ArgumentException("El diagnóstico no puede estar vacío.");
        }

        

    

}