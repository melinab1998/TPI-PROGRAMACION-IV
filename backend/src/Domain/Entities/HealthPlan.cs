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

    public HealthPlan(string name)
    {
        ValidateName(name);
        Name = name;
    }

    public static void ValidateName(string name)
     {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("El nombre del plan no puede estar vacío.");   
    }

    public void SetHealthInsurance(HealthInsurance healthInsurance)
    {
        HealthInsurance = healthInsurance ?? throw new ArgumentException("La obra social no puede ser nula.");
        HealthInsuranceId = healthInsurance.Id;
    }
}