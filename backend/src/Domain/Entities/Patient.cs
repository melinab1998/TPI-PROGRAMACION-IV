using System.Dynamic;
using System.Text.RegularExpressions;

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
        ValidateDni(dni);
        Dni = dni;
    }
    
    private static void ValidateDni(string dni)
    {
        if (string.IsNullOrWhiteSpace(dni))
            throw new ArgumentException("El DNI es obligatorio.");

        if (!Regex.IsMatch(dni, @"^\d{7,8}$"))
        throw new ArgumentException("El DNI no es válido.");
    }
    
    //Metodo para completar los datos al sacar turno
    public void CompleteDataForTurn(DateOnly birthDate, string address, string phoneNumber, string city, string membershipNumber, int healthPlanId)
    {
        if (string.IsNullOrWhiteSpace(address))
            throw new ArgumentException("La dirección es obligatoria.");
        if (string.IsNullOrWhiteSpace(phoneNumber))
            throw new ArgumentException("El teléfono es obligatorio.");
        if (!Regex.IsMatch(phoneNumber, @"^\d{7,15}$"))
            throw new ArgumentException("El teléfono debe contener solo números, entre 7 y 15 dígitos.");
        if (string.IsNullOrWhiteSpace(city))
            throw new ArgumentException("La ciudad es obligatoria.");
        if (string.IsNullOrWhiteSpace(membershipNumber))
            throw new ArgumentException("El número de afiliado es obligatorio.");

        BirthDate = birthDate;
        Address = address;
        PhoneNumber = phoneNumber;
        City = city;
        MembershipNumber = membershipNumber;
        HealthPlanId = healthPlanId;
    }
}