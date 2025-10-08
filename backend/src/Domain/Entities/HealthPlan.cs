namespace Domain.Entities
{
    public class HealthPlan
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Foreign Key
        public int HealthInsuranceId { get; set; }

        // Propiedad de navegación
        public HealthInsurance HealthInsurance { get; set; } = null!;

        public HealthPlan() { }

        public HealthPlan(string name)
        {
            Name = name;
        }
    }
}
