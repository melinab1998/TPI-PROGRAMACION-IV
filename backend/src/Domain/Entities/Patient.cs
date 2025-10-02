using System.Dynamic;

namespace Domain.Entities;

public class Patient : User
{
    public DateOnly BirthDate { get; set; }

    public string Dni { get; set; }

    public string Address { get; set; }

    public string PhoneNumber { get; set; }

    public string City { get; set; }

    public string MembershipNumber { get; set; }

    //Foreign Key
     public int HealthPlanId { get; set; }

    //Propiedad de navegación
    public HealthPlan? HealthPlan { get; set; }

    public Patient() { }

    public Patient(string firstName, string lastName, string email, string password, DateOnly birthDate, string dni, string address, string phoneNumber, string city, string membershipNumber, int healthPlanId) : base(firstName, lastName, email, password)
    {
        BirthDate = birthDate;
        Dni = dni;
        Address = address;
        PhoneNumber = phoneNumber;
        City = city;
        MembershipNumber = membershipNumber;
         HealthPlanId = healthPlanId;
    }
}