namespace Domain.Entities
{
    public class DentistHealthInsurance
    {
        public int Id { get; set; } 

        public int DentistId { get; set; }
        public Dentist Dentist { get; set; } = null!;

        public int HealthInsuranceId { get; set; }
        public HealthInsurance HealthInsurance { get; set; } = null!;
    }
}
