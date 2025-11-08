namespace Domain.Entities
{
    public class HealthPlan
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int HealthInsuranceId { get; set; }
        public HealthInsurance HealthInsurance { get; set; } = null!;

        public HealthPlan() { }

        public HealthPlan(string name, int healthInsuranceId)
        {
            Name = name;
            HealthInsuranceId = healthInsuranceId;
        }
    }
}