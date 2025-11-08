namespace Domain.Entities
{
    public class HealthInsurance
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ICollection<HealthPlan> Plans { get; set; } = new List<HealthPlan>();

        public HealthInsurance() { }

        public HealthInsurance(string name)
        {
            Name = name;
        }
    }
}
