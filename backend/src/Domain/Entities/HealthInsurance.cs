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
    
    
    public static void ValidateName(string name)
     {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("El nombre de la obra social  no puede estar vacío.");   
    }


    public void AddPlan(HealthPlan plan)
    {
        if (plan == null)
            throw new ArgumentException("El plan no puede ser nulo.");

        plan.SetHealthInsurance(this);
        Plans.Add(plan);

    }
}