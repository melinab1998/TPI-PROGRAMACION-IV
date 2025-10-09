namespace Domain.Entities;

public class Patient : User
{
    public string Dni { get; private set; }
    public DateOnly? BirthDate { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? City { get; set; }
    public string? MembershipNumber { get; set; }
    public int? HealthPlanId { get; set; }
    public HealthPlan? HealthPlan { get; set; }

    public Patient() { }

    public Patient(string firstName, string lastName, string email, string dni)
        : base(firstName, lastName, email, null!)
    {
        Dni = dni;
    }
}