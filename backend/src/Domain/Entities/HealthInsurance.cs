namespace Domain.Entities;

public class HealthInsurance
{
    public int Id { get; set; }
    public string Name { get; set; }
    
     // Relación con Planes (composición) => Lista con todos los planes que tiene una obra social
    public List<HealthPlan> Plans { get; set; } = new(); 

    public HealthInsurance() { }

    public HealthInsurance(string name)
    {
        Name = name;
    }
}