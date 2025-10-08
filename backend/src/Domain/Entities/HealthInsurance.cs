namespace Domain.Entities
{
    public class HealthInsurance
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<HealthPlan> Plans { get; set; } = new();
        public HealthInsurance() { }
        public HealthInsurance(string name)
        {
            Name = name;
        }
    }
}
