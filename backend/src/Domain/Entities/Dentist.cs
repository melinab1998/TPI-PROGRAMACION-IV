namespace Domain.Entities;

public class Dentist : User
{
    public string LicenseNumber { get; set; }


    public Dentist() : base() { }

    public Dentist(string firstName, string lastName, string email, string password, string licenseNumber) : base(firstName, lastName, email, password)
    {
        ValidateLicenseNumber(licenseNumber);
        LicenseNumber = licenseNumber;
    }

    private static void ValidateLicenseNumber(string licenseNumber)
    {
        if (string.IsNullOrWhiteSpace(licenseNumber))
            throw new ArgumentException("La matrícula es obligatoria.");
    }
 }
    
