namespace Domain.Entities;

public class Patient : User
{
    public string Dni { get; private set; }

    // Datos opcionales 
    public DateOnly? BirthDate { get; private set; }
    public string? Address { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? City { get; private set; }
    public string? MembershipNumber { get; private set; }

    //Foreign Key
    public int? HealthPlanId { get; set; }

    //Propiedad de navegación
    public HealthPlan? HealthPlan { get; set; }

    public Patient() { }

    public Patient(string firstName, string lastName, string email, string password, string dni) : base(firstName, lastName, email, password)
    {
        Dni = dni;
    }
}