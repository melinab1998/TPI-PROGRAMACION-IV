namespace Domain.Entities;

public class HealthPlan
{
    public int Id { get; set; }

    public string Name { get; set; }

    //Foreign Key    
    public int HealthInsuranceId { get; set; }
    
    // Referencia a la obra social que pertenece un determinado plan
    public HealthInsurance HealthInsurance { get; set; } = null!;

    public HealthPlan() { }

    public HealthPlan( string name)
    {
        Name = name;
    }
}